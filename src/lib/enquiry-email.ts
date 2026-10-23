// The two emails a contact-form enquiry sends: one to me, one back to the visitor.
import { mailto, renderEmail, type RenderedEmail } from "./email.ts";
import { describeSource, type EnquiryFields } from "./enquiry.ts";
import { channels } from "./site.ts";
import { SITE } from "./seo.ts";

export const CONTACT_EMAIL = "contact@taiatiniyara.com";

const when = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Pacific/Fiji", timeZoneName: "short" }).format(d);

const oneLine = (s: string, max: number) => (s.replace(/\s+/g, " ").length > max ? `${s.replace(/\s+/g, " ").slice(0, max - 1).trimEnd()}…` : s.replace(/\s+/g, " "));

/** To me: the whole enquiry, with the visitor's address as Reply-To. */
export function enquiryNotification(e: EnquiryFields, at: Date): RenderedEmail {
  const subject = `New enquiry from ${e.email}`;
  return renderEmail({
    subject,
    preheader: oneLine(e.message, 90),
    heading: "New enquiry",
    highlight: "enquiry",
    intro: ["Someone sent a message through the contact form."],
    details: [
      { label: "From", value: e.email, href: mailto(e.email) },
      { label: "Timeline", value: e.timeline || "Not given" },
      { label: "Came from", value: describeSource(e) },
      { label: "Received", value: when(at) },
    ],
    quote: { label: "Message", text: e.message },
    actions: [
      { label: "Reply", href: mailto(e.email, "Re: your message to Taia Tiniyara") },
      { label: "Open the inbox", href: `${SITE}/admin/enquiries` },
    ],
    footer: ["Replying to this email also goes straight to them.", "Every enquiry is saved in the inbox at /admin/enquiries."],
  });
}

/**
 * To the visitor: confirms the message arrived and what happens next.
 * It does not repeat their message. Anyone can type any address into the form, so echoing free text
 * would let this email carry someone else's words, from my domain, to a stranger.
 */
export function enquiryAcknowledgement(e: EnquiryFields, at: Date, replyTo: string, booking = channels().find((c) => c.id === "booking")?.href): RenderedEmail {
  return renderEmail({
    subject: "I've got your message",
    preheader: "I read every message myself and I'll write back to this address.",
    heading: "Thanks, I've got it.",
    highlight: "got it.",
    intro: ["Your message reached me. I read every one myself, so a real reply is coming, not an auto-reply."],
    details: [
      { label: "Sent", value: when(at) },
      { label: "Timeline", value: e.timeline || "Not given" },
      { label: "Reply to", value: e.email },
    ],
    steps: {
      title: "What happens next",
      items: [
        "I read what you wrote.",
        "I write back, usually with a few questions about what you're building and who it's for.",
        "If we're a good fit, we agree the scope, the price and the dates before any work starts.",
      ],
    },
    actions: [
      ...(booking ? [{ label: "Book a 15-minute call", href: booking }] : []),
      { label: "Look at the work", href: `${SITE}/projects` },
      { label: "How we'd work together", href: `${SITE}/about` },
    ],
    outro: [`Want to add something? Reply to this email, or write to ${replyTo}.`],
    footer: [
      "Taia Tiniyara · taiatiniyara.com",
      "You're getting this because this address was entered on the contact form at taiatiniyara.com. If that wasn't you, ignore it. I won't write to you again.",
      "I keep your message, and which page you came from, only to reply and to learn which pages bring enquiries.",
    ],
  });
}
