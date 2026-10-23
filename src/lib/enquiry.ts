// Contact form rules, shared by the server (authoritative) and the browser (inline hints on blur).
/** Optional answers; an empty value means "Not sure yet". */
export const TIMELINES = ["As soon as possible", "In the next 3 months", "Later this year"] as const;

export interface EnquiryFields {
  email: string;
  message: string;
  timeline: string;
}
export type EnquiryErrors = Partial<Record<keyof EnquiryFields, string>>;

const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;

/** Returns what the visitor should do next, or null when the value is fine. */
export function checkField(name: keyof EnquiryFields, raw: string): string | null {
  const v = raw.trim();
  if (name === "email") {
    if (!v) return "Enter your email so I can reply, like name@site.com.";
    if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter an email like name@site.com.";
  }
  if (name === "message") {
    if (v.length < MESSAGE_MIN) return "Tell me what you're building and who it's for, in a sentence or two.";
    if (v.length > MESSAGE_MAX) return `Shorten this to ${MESSAGE_MAX} characters. You can send more detail when I reply.`;
  }
  if (name === "timeline" && v && !(TIMELINES as readonly string[]).includes(v)) return "Choose one of the options.";
  return null;
}

export type ParsedEnquiry =
  | { ok: true; value: EnquiryFields; spam: boolean }
  | { ok: false; errors: EnquiryErrors; values: EnquiryFields };

export function parseEnquiry(form: FormData): ParsedEnquiry {
  const get = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : "";
  };
  const values: EnquiryFields = { email: get("email").trim(), message: get("message").trim(), timeline: get("timeline").trim() };
  const errors: EnquiryErrors = {};
  for (const k of ["email", "message", "timeline"] as const) {
    const e = checkField(k, values[k]);
    if (e) errors[k] = e;
  }
  // Real people never see the "website" field; bots fill every input they find.
  if (get("website")) return { ok: true, value: values, spam: true };
  return Object.keys(errors).length ? { ok: false, errors, values } : { ok: true, value: values, spam: false };
}

/** Plain-text notification body. */
export const enquirySubject = (e: EnquiryFields) => `New enquiry from ${e.email}`;
export const enquiryText = (e: EnquiryFields) => `${e.message}\n\nTimeline: ${e.timeline || "Not given"}\nReply to: ${e.email}\n`;
