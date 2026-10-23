// What I sell and how people reach me. Edit this file; no page needs touching.

export interface Offer {
  id: string;
  name: string;
  /** One sentence: what the buyer gets. */
  summary: string;
  /** Who it suits. */
  forWhom: string;
  includes: string[];
  timing: string;
  /** Starting price with currency, e.g. "FJD 8,000". Leave null to show "Ask for a quote". */
  from: string | null;
}

export const OFFERS: Offer[] = [
  {
    id: "launch",
    name: "Launch",
    summary: "A new web app, mobile app or API, built and live.",
    forWhom: "Founders and small teams with an idea and no developer.",
    includes: ["A fixed price, agreed before work starts", "Working software to try every week", "The code, docs and accounts are yours"],
    timing: "A first version in 4 to 6 weeks.",
    from: null,
  },
  {
    id: "rescue",
    name: "Rescue",
    summary: "An app that stalled or keeps breaking, fixed or finished.",
    forWhom: "Teams stuck with half-built or unreliable software.",
    includes: ["A short audit of what's there", "A written list of what to fix, in order", "A fixed price for that list"],
    timing: "Audit first, then a date you can plan around.",
    from: null,
  },
  {
    id: "keep",
    name: "Keep",
    summary: "Changes, hosting and support after launch.",
    forWhom: "Anyone who wants the app looked after, not abandoned.",
    includes: ["Fixes and small changes every month", "Hosting and backups watched", "One person who already knows the code"],
    timing: "Month to month. Stop any time.",
    from: null,
  },
];

export const priceLabel = (o: Pick<Offer, "from">) => (o.from ? `From ${o.from}` : "Ask for a quote");

/**
 * Direct ways to reach me besides the form. A channel with no value is simply not shown.
 *   booking:   full https link to a booking page (Cal.com, Calendly, ...)
 *   whatsapp:  number with country code, digits only or in any format, e.g. "+679 123 4567"
 *   messenger: Facebook username or page name, as in m.me/<name>
 */
export const CHANNELS = {
  booking: "",
  whatsapp: "",
  messenger: "",
};

export type ChannelId = keyof typeof CHANNELS;
export interface Channel {
  id: ChannelId;
  label: string;
  href: string;
}

export function channels(config: Record<ChannelId, string> = CHANNELS): Channel[] {
  const out: Channel[] = [];
  const booking = config.booking.trim();
  if (/^https:\/\/[^\s]+$/.test(booking)) out.push({ id: "booking", label: "Book a 15-minute call", href: booking });
  const digits = config.whatsapp.replace(/[\s\-().+]/g, "");
  if (/^\d{8,15}$/.test(digits)) out.push({ id: "whatsapp", label: "Message on WhatsApp", href: `https://wa.me/${digits}` });
  const messenger = config.messenger.trim();
  if (/^[A-Za-z0-9.]{5,50}$/.test(messenger)) out.push({ id: "messenger", label: "Message on Messenger", href: `https://m.me/${messenger}` });
  return out;
}

/** Link to the contact page that records which page or button sent the visitor there. */
export const contactHref = (from: string) => `/contact?from=${encodeURIComponent(from)}`;
