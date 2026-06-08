const PREFIX = "[taia]"

type EnvCheck = {
  key: string
  value: string | undefined
  required: boolean
  defaultValue?: string
  hint: string
}

function warn(msg: string) {
  console.warn(`${PREFIX} WARNING: ${msg}`)
}

const checks: EnvCheck[] = [
  // ── Admin / Auth ────────────────────────────────────────────────────
  {
    key: "ADMIN_PASSWORD",
    value: process.env.ADMIN_PASSWORD,
    required: true,
    hint: "The password used to log into the admin panel at /admin/login.",
  },
  {
    key: "SESSION_SECRET",
    value: process.env.SESSION_SECRET,
    required: true,
    defaultValue: "change-me-in-production",
    hint: "HMAC signing key for admin session cookies. Generate with: openssl rand -hex 32",
  },

  // ── Site ─────────────────────────────────────────────────────────────
  {
    key: "NEXT_PUBLIC_SITE_URL",
    value: process.env.NEXT_PUBLIC_SITE_URL,
    required: true,
    hint: "Public URL of the site (e.g. https://taiatiniyara.com). Used for canonical URLs, sitemap, JSON-LD, and og:image paths.",
  },

  // ── Cloudflare R2 ────────────────────────────────────────────────────
  {
    key: "R2_ACCOUNT_ID",
    value: process.env.R2_ACCOUNT_ID,
    required: true,
    hint: "Cloudflare account ID (found in the R2 dashboard URL or Cloudflare dashboard → Workers & Pages → Account ID).",
  },
  {
    key: "R2_ACCESS_KEY_ID",
    value: process.env.R2_ACCESS_KEY_ID,
    required: true,
    hint: "R2 API token access key ID. Create via: Cloudflare Dashboard → R2 → Manage R2 API Tokens.",
  },
  {
    key: "R2_SECRET_ACCESS_KEY",
    value: process.env.R2_SECRET_ACCESS_KEY,
    required: true,
    hint: "R2 API token secret access key (shown once when you create the token).",
  },
  {
    key: "R2_BUCKET_NAME",
    value: process.env.R2_BUCKET_NAME,
    required: true,
    hint: "Name of the R2 bucket for uploads (e.g. taiatiniyara).",
  },
  {
    key: "R2_PUBLIC_URL",
    value: process.env.R2_PUBLIC_URL,
    required: false,
    hint: "Public URL of your R2 bucket (e.g. https://pub-xxx.r2.dev, or custom domain). Falls back to *.r2.dev pattern for image optimization.",
  },

  // ── SMTP / Email ─────────────────────────────────────────────────────
  {
    key: "SMTP_HOST",
    value: process.env.SMTP_HOST,
    required: false,
    hint: "SMTP server hostname for sending contact form email notifications.",
  },
  {
    key: "SMTP_PORT",
    value: process.env.SMTP_PORT,
    required: false,
    hint: "SMTP port (465 for SSL, 587 for STARTTLS). Defaults to 587 if unset.",
  },
  {
    key: "SMTP_USER",
    value: process.env.SMTP_USER,
    required: false,
    hint: "SMTP username (usually your email address).",
  },
  {
    key: "SMTP_PASS",
    value: process.env.SMTP_PASS,
    required: false,
    hint: "SMTP password or app-specific password.",
  },
  {
    key: "SMTP_FROM",
    value: process.env.SMTP_FROM,
    required: false,
    hint: "From address for outgoing emails (e.g. 'Taia Tiniyara <noreply@taiatiniyara.com>').",
  },
  {
    key: "NOTIFICATION_EMAIL",
    value: process.env.NOTIFICATION_EMAIL,
    required: false,
    defaultValue: "taiatiniyara@gmail.com",
    hint: "Email address where contact form notifications are sent.",
  },
]

export function validateEnv() {
  let hasErrors = false

  for (const check of checks) {
    // Required and missing
    if (check.required && !check.value) {
      warn(`${check.key} is not set. ${check.hint}`)
      hasErrors = true
      continue
    }

    // Has a default and still using it
    if (check.defaultValue !== undefined && check.value === check.defaultValue) {
      warn(`${check.key} is using the default value ("${check.defaultValue}"). ${check.hint}`)
      hasErrors = true
      continue
    }
  }

  // Smarter checks: R2 KEY/SECRET with placeholder values
  if (
    process.env.R2_ACCESS_KEY_ID === "your-access-key-id" ||
    process.env.R2_SECRET_ACCESS_KEY === "your-secret-access-key"
  ) {
    warn("R2 credentials are still placeholder values. Update R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in your .env file.")
    hasErrors = true
  }

  // ADMIN_PASSWORD hints
  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length < 8) {
    warn("ADMIN_PASSWORD is too short (< 8 characters). Use a stronger password.")
    hasErrors = true
  }

  // SMTP group: if any SMTP var is set, all should be set
  const smtpVars = [
    process.env.SMTP_HOST,
    process.env.SMTP_USER,
    process.env.SMTP_PASS,
    process.env.SMTP_FROM,
  ]
  const someSet = smtpVars.some(Boolean)
  const allSet = smtpVars.every(Boolean)
  if (someSet && !allSet) {
    const missing = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"].filter(
      (_, i) => !smtpVars[i],
    )
    warn(`Some SMTP variables are set but others are missing: ${missing.join(", ")}. Contact form email notifications will not work until all SMTP variables are configured.`)
    hasErrors = true
  }

  // R2 group: if any R2 var is set, all should be set
  const r2Vars = [
    process.env.R2_ACCOUNT_ID,
    process.env.R2_ACCESS_KEY_ID,
    process.env.R2_SECRET_ACCESS_KEY,
    process.env.R2_BUCKET_NAME,
  ]
  const r2SomeSet = r2Vars.some(Boolean)
  const r2AllSet = r2Vars.every(Boolean)
  if (r2SomeSet && !r2AllSet) {
    const missing = [
      "R2_ACCOUNT_ID",
      "R2_ACCESS_KEY_ID",
      "R2_SECRET_ACCESS_KEY",
      "R2_BUCKET_NAME",
    ].filter((_, i) => !r2Vars[i])
    warn(`Some R2 variables are set but others are missing: ${missing.join(", ")}. File uploads will not work until all R2 variables are configured.`)
    hasErrors = true
  }

  if (!hasErrors) {
    console.log(`${PREFIX} All environment variables look good.`)
  }
}

// Auto-run on import (side-effect in next.config.ts)
validateEnv()
