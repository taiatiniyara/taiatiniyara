import { createTransport } from "nodemailer"

const transport = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = process.env.SMTP_FROM ?? ""

export async function sendContactNotification(data: {
  name: string
  email: string
  message: string
}) {
  await transport.sendMail({
    from: FROM,
    to: FROM,
    replyTo: data.email,
    subject: `New Contact Message from ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
  })
}
