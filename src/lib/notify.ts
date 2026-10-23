import { env } from "cloudflare:workers";
import { enquirySubject, enquiryText, type EnquiryFields } from "./enquiry.ts";

// Optional: emails each enquiry to ADMIN_EMAIL. Does nothing until an EMAIL binding is added to wrangler.jsonc
// (see the comment there), so the inbox at /admin/enquiries is the only place messages land until then.
const FROM = { name: "taiatiniyara.com", email: "no-reply@taiatiniyara.com" };

export async function notifyEnquiry(e: EnquiryFields) {
  const mail = (env as { EMAIL?: SendEmail }).EMAIL;
  if (!mail) return;
  try {
    await mail.send({ from: FROM, to: env.ADMIN_EMAIL, replyTo: e.email, subject: enquirySubject(e), text: enquiryText(e) });
  } catch (err) {
    console.error("Could not email the enquiry; it is saved in /admin/enquiries.", err);
  }
}
