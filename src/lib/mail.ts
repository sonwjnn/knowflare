import nodemailer from 'nodemailer'

const domain = process.env.NEXT_PUBLIC_APP_URL

const PORT = process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587
const HOST = process.env.MAIL_HOST
const USER = process.env.MAIL_USER
const PASSWORD = process.env.MAIL_PASSWORD
const IGNORE_TLS = process.env.MAIL_IGNORE_TLS === 'true'
const SECURE = process.env.MAIL_SECURE === 'true'
const REQUIRE_TLS = process.env.MAIL_REQUIRE_TLS === 'true'

const DEFAULT_EMAIL = process.env.MAIL_DEFAULT_EMAIL
const DEFAULT_NAME = process.env.MAIL_DEFAULT_NAME

export const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  ignoreTLS: IGNORE_TLS,
  secure: SECURE,
  requireTLS: REQUIRE_TLS,
  auth: {
    user: USER,
    pass: PASSWORD,
  },
})

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await transporter.sendMail({
    from: DEFAULT_EMAIL,
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`

  await transporter.sendMail({
    from: DEFAULT_EMAIL,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  })
}

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`

  await transporter.sendMail({
    from: DEFAULT_EMAIL,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  })
}
