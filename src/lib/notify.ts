import { env } from "cloudflare:workers";
import { CONTACT_EMAIL, enquiryAcknowledgement, enquiryNotification } from "./enquiry-email.ts";
import type { EnquiryFields } from "./enquiry.ts";

// Each enquiry sends two emails through the EMAIL binding (see wrangler.jsonc), both from contact@:
// one to ADMIN_EMAIL with the visitor as Reply-To, and an acknowledgement back to the visitor.
// With no EMAIL binding (a local run without it) this does nothing, and the inbox at /admin/enquiries
// is the only place messages land. A failed send never loses the enquiry: it is already saved.
const FROM = { name: "Taia Tiniyara", email: CONTACT_EMAIL };

export async function notifyEnquiry(e: EnquiryFields, at = new Date()) {
  const mail = (env as { EMAIL?: SendEmail }).EMAIL;
  if (!mail) return;
  const toMe = enquiryNotification(e, at);
  const toThem = enquiryAcknowledgement(e, at, env.ADMIN_EMAIL);
  // Sent independently, so a bounce on the visitor's address can't stop the one that reaches me.
  const results = await Promise.allSettled([
    mail.send({ from: { ...FROM, name: "taiatiniyara.com contact form" }, to: env.ADMIN_EMAIL, replyTo: e.email, ...toMe }),
    mail.send({
      from: FROM,
      to: e.email,
      replyTo: env.ADMIN_EMAIL,
      ...toThem,
      // Marks it as an automatic reply so other auto-responders (out-of-office, ticket bots) don't answer it.
      headers: { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All" },
    }),
  ]);
  const labels = ["enquiry notification", "acknowledgement"];
  results.forEach((r, i) => r.status === "rejected" && console.error(`Could not send the ${labels[i]} email; the enquiry is saved in /admin/enquiries.`, r.reason));
}
