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
const TO = process.env.NOTIFICATION_EMAIL ?? "taiatiniyara@gmail.com"

// ── Brand tokens (pink/rose palette matching the app theme) ───────────
const BRAND = {
  primary: "#e11d48",
  primaryLight: "#fda4af",
  primaryDark: "#9f1239",
  white: "#ffffff",
  black: "#171717",
  gray: "#525252",
  grayLight: "#f5f5f5",
  grayBorder: "#e5e5e5",
}

// ── Base email shell ──────────────────────────────────────────────────
function emailShell(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:${BRAND.grayLight};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.grayLight};padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0 32px;text-align:center;">
              <span style="font-size:20px;font-weight:700;color:${BRAND.black};letter-spacing:-0.5px;">
                Taia Tiniyara
              </span>
              <p style="font-size:13px;color:${BRAND.gray};margin:4px 0 0 0;">
                Software Engineering Studio
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px 32px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.white};border:1px solid ${BRAND.grayBorder};">
                <tr>
                  <td style="padding:32px;">
                    ${body}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 32px 32px;text-align:center;">
              <p style="font-size:12px;color:${BRAND.gray};margin:0;">
                Taia Tiniyara, LLC &copy; ${new Date().getFullYear()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ── Reusable components ───────────────────────────────────────────────

function h2(text: string): string {
  return `<h2 style="font-size:18px;font-weight:700;color:${BRAND.black};margin:0 0 8px 0;letter-spacing:-0.3px;">${escapeHtml(text)}</h2>`
}

function field(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid ${BRAND.grayBorder};font-size:13px;color:${BRAND.gray};font-weight:500;width:120px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid ${BRAND.grayBorder};font-size:14px;color:${BRAND.black};">${escapeHtml(value)}</td>
  </tr>`
}

function button(text: string, href: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background-color:${BRAND.primary};color:${BRAND.white};font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;margin-top:16px;">${escapeHtml(text)}</a>`
}

function messageBlock(text: string): string {
  return `<div style="margin-top:20px;padding:16px;background-color:${BRAND.grayLight};font-size:14px;color:${BRAND.black};line-height:1.6;white-space:pre-wrap;">${escapeHtml(text)}</div>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// ── Labels map ────────────────────────────────────────────────────────

const PROJECT_TYPE_LABELS: Record<string, string> = {
  "web-app": "Web App",
  "mobile-app": "Mobile App",
  api: "API / Backend",
  saas: "SaaS Product",
  other: "Other",
}

const TIMELINE_LABELS: Record<string, string> = {
  asap: "ASAP",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  exploring: "Just exploring",
}

const BUDGET_LABELS: Record<string, string> = {
  "under-5k": "Under $5k",
  "5k-25k": "$5k – $25k",
  "25k-plus": "$25k+",
}

// ── Contact notification ──────────────────────────────────────────────

export async function sendContactNotification(data: {
  name: string
  email: string
  message: string
  projectType?: string | undefined
  timeline?: string | undefined
  budgetRange?: string | undefined
}) {
  const projectLabel = data.projectType
    ? PROJECT_TYPE_LABELS[data.projectType] ?? data.projectType
    : ""
  const timelineLabel = data.timeline
    ? TIMELINE_LABELS[data.timeline] ?? data.timeline
    : ""
  const budgetLabel = data.budgetRange
    ? BUDGET_LABELS[data.budgetRange] ?? data.budgetRange
    : ""

  const body = `
    ${h2("New Inquiry")}
    <p style="font-size:14px;color:${BRAND.gray};margin:0 0 20px 0;">Someone submitted the contact form on your site.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
      ${field("Name", data.name)}
      ${field("Email", data.email)}
      ${projectLabel ? field("Project Type", projectLabel) : ""}
      ${timelineLabel ? field("Timeline", timelineLabel) : ""}
      ${budgetLabel ? field("Budget", budgetLabel) : ""}
    </table>

    ${data.message ? messageBlock(data.message) : ""}

    ${button("Reply to " + data.name.split(" ")[0], `mailto:${data.email}`)}
  `

  const textFallback = [
    `New Inquiry from ${data.name}`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.projectType ? `Project Type: ${projectLabel}` : "",
    data.timeline ? `Timeline: ${timelineLabel}` : "",
    data.budgetRange ? `Budget: ${budgetLabel}` : "",
    "",
    data.message,
    "",
    `Reply: ${data.email}`,
  ]
    .filter(Boolean)
    .join("\n")

  await transport.sendMail({
    from: FROM,
    to: TO,
    replyTo: data.email,
    subject: `New Inquiry from ${data.name}`,
    html: emailShell(body),
    text: textFallback,
  })
}

// ── Contact acknowledgement ───────────────────────────────────────────

export async function sendContactAcknowledgement(data: {
  name: string
  email: string
  message: string
}) {
  const firstName = data.name.split(" ")[0]

  const body = `
    ${h2("Thanks for reaching out" + (firstName ? ", " + firstName : ""))}
    <p style="font-size:14px;color:${BRAND.gray};margin:0 0 20px 0;line-height:1.6;">
      We received your message and will get back to you within 24 hours.
      In the meantime, here is a copy of what you sent us.
    </p>

    ${data.message ? messageBlock(data.message) : ""}

    <p style="font-size:14px;color:${BRAND.gray};margin:24px 0 0 0;line-height:1.6;">
      If you have any questions in the meantime, just reply to this email.
    </p>

    <p style="font-size:14px;color:${BRAND.black};margin:16px 0 0 0;font-weight:600;">
      &mdash; Taia Tiniyara
    </p>
  `

  const textFallback = [
    `Hi ${firstName || data.name},`,
    "",
    "Thanks for reaching out. We received your message and will get back to you within 24 hours.",
    "",
    "Your message:",
    data.message,
    "",
    "If you have any questions, just reply to this email.",
    "",
    "— Taia Tiniyara",
  ].join("\n")

  await transport.sendMail({
    from: FROM,
    to: data.email,
    subject: "We received your message — Taia Tiniyara",
    html: emailShell(body),
    text: textFallback,
  })
}

// ── Admin reply ────────────────────────────────────────────────────────

export async function sendReply(data: {
  toName: string
  toEmail: string
  replyBody: string
}) {
  const firstName = data.toName.split(" ")[0]

  const body = `
    ${h2("Hi" + (firstName ? " " + firstName : ""))}
    <p style="font-size:14px;color:${BRAND.black};margin:0 0 20px 0;line-height:1.6;">
      ${escapeHtml(data.replyBody).replace(/\n/g, "<br>")}
    </p>

    <p style="font-size:14px;color:${BRAND.gray};margin:24px 0 0 0;line-height:1.6;">
      If you have any questions, just reply to this email.
    </p>

    <p style="font-size:14px;color:${BRAND.black};margin:16px 0 0 0;font-weight:600;">
      &mdash; Taia Tiniyara
    </p>
  `

  const textFallback = [
    `Hi ${firstName || data.toName},`,
    "",
    data.replyBody,
    "",
    "If you have any questions, just reply to this email.",
    "",
    "— Taia Tiniyara",
  ].join("\n")

  await transport.sendMail({
    from: FROM,
    to: data.toEmail,
    subject: "Re: Your inquiry — Taia Tiniyara",
    html: emailShell(body),
    text: textFallback,
  })
}
