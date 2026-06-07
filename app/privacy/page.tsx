import type { Metadata } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taiatiniyara.com"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Taia Tiniyara, LLC.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
}

export default function PrivacyPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {new Date().getFullYear()}
        </p>

        <div className="mt-12 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p>
              When you submit the contact form on our website, we collect your
              name, email address, and the message you provide. We use this
              information solely to respond to your inquiry.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to your contact form submissions.</li>
              <li>To communicate with you about your inquiries.</li>
              <li>We do not sell, trade, or share your personal information with third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. Data Storage</h2>
            <p>
              Contact form submissions are stored in our secure database and
              transmitted via encrypted email. We retain this data for as long as
              needed to serve our business relationship.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Cookies</h2>
            <p>
              We use a session cookie for the admin dashboard. We do not use
              tracking cookies or analytics services on the public website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
            <p>
              If you have questions about this privacy policy, please contact us
              via the contact form on our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
