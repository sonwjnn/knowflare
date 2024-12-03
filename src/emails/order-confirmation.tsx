import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { CSSProperties } from 'react'

type Props = {
  customerName: string
  orderId: string
  data: {
    imageUrl: string
    title: string
    price: number
  }[]
}

export const OrderConfirmationEmail = ({
  customerName,
  orderId,
  data,
}: Props) => {
  const totalPrice = data.reduce((sum, item) => sum + item.price, 0)

  return (
    <Html>
      <Head />
      <Preview>Your order #{orderId} has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmation</Heading>
          <Text style={text}>Hello {customerName},</Text>
          <Text style={text}>
            Thank you for your purchase. We&apos;re excited to confirm that your
            order has been received and is being processed.
          </Text>
          <Section style={orderInfo}>
            <Text style={orderInfoText}>
              Order Number: <span style={highlight}>{orderId}</span>
            </Text>
          </Section>
          <Heading as="h2" style={h2}>
            Order Summary
          </Heading>
          {data.map((item, index) => (
            <Section key={index} style={productInfo}>
              <Img
                src={item.imageUrl}
                width="80"
                height="80"
                alt={item.title}
                style={productImage}
              />
              <div style={productDetails}>
                <Text style={productTitle}>{item.title}</Text>
                <Text style={productPrice}>{item.price}$</Text>
              </div>
            </Section>
          ))}
          <Hr style={divider} />
          <Section style={totalSection}>
            <Text style={totalText}>Total</Text>
            <Text style={totalPrice as CSSProperties}>
              ${totalPrice.toFixed(2)}
            </Text>
          </Section>
          <Text style={text}>
            If you have any questions about your order, please don&apos;t
            hesitate to{' '}
            <Link style={link} href="https://knowflare-weld.vercel.app/support">
              contact our support team
            </Link>
            .
          </Text>
          <Text style={text}>Thank you for shopping with KnowFlare!</Text>
          <Hr style={divider} />
          <Text style={footer}>
            © 2023 KnowFlare. All rights reserved.
            <br />
            123 KnowFlare Street, Knowledge City, KN 12345
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail

const main: CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container: CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  width: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

const logo: CSSProperties = {
  margin: '0 auto 20px',
  display: 'block',
}

const h1: CSSProperties = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const h2: CSSProperties = {
  color: '#1a1a1a',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '30px 0 15px',
}

const text: CSSProperties = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '26px',
}

const orderInfo: CSSProperties = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#f8f8f8',
  borderRadius: '4px',
}

const orderInfoText: CSSProperties = {
  ...text,
  margin: '8px 0',
}

const highlight: CSSProperties = {
  color: '#2754C5',
  fontWeight: 'bold',
}

const link: CSSProperties = {
  color: '#2754C5',
  fontWeight: 'bold',
}

const productInfo: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
}

const productImage: CSSProperties = {
  width: '100%',
  maxWidth: '128px',
  aspectRatio: '16/9',
  objectFit: 'cover',
  borderRadius: '4px',
}

const productDetails: CSSProperties = {
  flex: 1,
}

const productTitle: CSSProperties = {
  ...text,
  fontWeight: 'bold',
  margin: '0 0 4px',
}

const productPrice: CSSProperties = {
  ...text,
  margin: '0',
}

const divider: CSSProperties = {
  borderTop: '1px solid #e6e6e6',
  margin: '30px 0',
}

const totalSection: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '20px 0',
}

const totalText: CSSProperties = {
  ...text,
  fontWeight: 'bold',
  fontSize: '18px',
}

const totalPrice: CSSProperties = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#2754C5',
}

const footer: CSSProperties = {
  ...text,
  textAlign: 'center' as const,
  color: '#8898aa',
  fontSize: '14px',
}
