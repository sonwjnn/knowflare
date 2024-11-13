import { db } from '@/db/drizzle'
import {
  carts,
  insertCoursesSchema,
  orders,
  purchases,
  subscriptions,
} from '@/db/schema'
import { stripe } from '@/lib/stripe'
import { verifyAuth } from '@hono/auth-js'
import { zValidator } from '@hono/zod-validator'
import { and, eq, isNotNull } from 'drizzle-orm'
import { Hono } from 'hono'
import Stripe from 'stripe'
import { z } from 'zod'

const app = new Hono()
  .post('/billing', verifyAuth(), async c => {
    const auth = c.get('authUser')

    if (!auth.token?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const [order] = await db
      .select({
        customerId: orders.customerId,
      })
      .from(orders)
      .where(and(eq(orders.userId, auth.token.id)))

    if (!order) {
      return c.json({ error: 'No payment found' }, 404)
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: order.customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}`,
    })

    if (!session.url) {
      return c.json({ error: 'Failed to create session' }, 400)
    }

    return c.json({ data: session.url })
  })
  // .get("/current", verifyAuth(), async (c) => {
  //   const auth = c.get("authUser");

  //   if (!auth.token?.id) {
  //     return c.json({ error: "Unauthorized" }, 401);
  //   }

  //   const [subscription] = await db
  //     .select()
  //     .from(subscriptions)
  //     .where(eq(subscriptions.userId, auth.token.id));

  //   const active = checkIsActive(subscription);

  //   return c.json({
  //     data: {
  //       ...subscription,
  //       active,
  //     },
  //   });
  // })
  .post(
    '/checkout',
    verifyAuth(),
    zValidator(
      'json',
      z.object({
        courses: z.array(
          insertCoursesSchema.pick({
            id: true,
            title: true,
            imageUrl: true,
            price: true,
          })
        ),
      })
    ),
    async c => {
      const auth = c.get('authUser')

      if (!auth.token?.id) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const { courses } = c.req.valid('json')

      const line_items = courses.map(item => ({
        quantity: 1,
        price_data: {
          currency: 'USD',
          product_data: {
            name: item.title,
            images: [item.imageUrl] as string[],
          },

          unit_amount: (item.price || 0) * 100,
        },
      }))

      const [existingOrder] = await db
        .select({
          customerId: orders.customerId,
        })
        .from(orders)
        .where(
          and(eq(orders.userId, auth.token.id), isNotNull(orders.customerId))
        )
        .limit(1)

      let customerId = existingOrder?.customerId

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: auth.token.email || '',
        })
        customerId = customer.id
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/checkout?success=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/checkout?canceled=1`,
        payment_method_types: ['card'],
        mode: 'payment',
        billing_address_collection: 'auto',
        invoice_creation: {
          enabled: true,
        },
        metadata: {
          productIds: JSON.stringify(courses.map(item => item.id)),
          userId: auth.token.id,
          total_amount: courses.reduce(
            (acc, item) => acc + (item.price || 0),
            0
          ),
        },
      })

      const url = session.url

      if (!url) {
        return c.json({ error: 'Failed to create session' }, 400)
      }

      return c.json({ data: url })
    }
  )
  .post('/webhook', async c => {
    const body = await c.req.text()
    const signature = c.req.header('Stripe-Signature') as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (error) {
      return c.json({ error: 'Invalid signature' }, 400)
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
      const payment = await stripe.paymentIntents.retrieve(
        session.payment_intent as string
      )

      if (!session?.metadata?.userId) {
        return c.json({ error: 'Invalid session' }, 400)
      }

      await db.insert(orders).values({
        status: payment.status,
        userId: session.metadata.userId,
        paymentId: payment.id,
        customerId: payment.customer as string,
        totalAmount: +session?.metadata?.total_amount as number,
      })

      const courseIds = JSON.parse(session?.metadata?.productIds) as string[]

      // insert owner courses
      const purchasesData = courseIds
        .map(id => ({
          userId: session?.metadata?.userId!,
          courseId: id,
          date: new Date(),
        }))
        .filter(data => data.userId !== undefined)

      await db.insert(purchases).values(purchasesData)

      // clear cart
      await db.delete(carts).where(eq(carts.userId, session?.metadata?.userId!))
    }

    if (event.type === 'invoice.payment_succeeded') {
      const payment = await stripe.paymentIntents.retrieve(
        session.payment_intent as string
      )

      if (!session?.metadata?.userId) {
        return c.json({ error: 'Invalid session' }, 400)
      }

      await db
        .update(orders)
        .set({
          status: payment.status,
          updatedAt: new Date(),
        })
        .where(eq(orders.paymentId, payment.id))
    }

    return c.json(null, 200)
  })

export default app
