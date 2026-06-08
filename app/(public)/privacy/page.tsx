import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ""

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Taia Tiniyara, LLC.",
  openGraph: {
    title: "Privacy Policy | Taia Tiniyara",
    description: "Privacy policy for Taia Tiniyara, LLC.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Taia Tiniyara",
    description: "Privacy policy for Taia Tiniyara, LLC.",
  },
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {new Date().getFullYear()}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="font-semibold text-lg">Information We Collect</h2>
          <p className="mt-2">
            When you use our contact form, we collect your name, email address,
            and message content. This information is used solely to respond to
            your inquiry.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">How We Use Your Information</h2>
          <p className="mt-2">
            Your information is used exclusively for communicating with you
            about your inquiry or project. We do not sell, share, or distribute
            your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">Data Storage</h2>
          <p className="mt-2">
            Contact form submissions are stored securely on our server. You may
            request deletion of your data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">Cookies</h2>
          <p className="mt-2">
            This website may use essential cookies for functionality. We do not
            use tracking cookies or analytics services.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg">Contact</h2>
          <p className="mt-2">
            For questions about this privacy policy, contact us through our
            contact form or email.
          </p>
        </section>
      </div>
    </div>
  )
}
