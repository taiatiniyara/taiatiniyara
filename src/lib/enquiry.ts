// Contact form rules, shared by the server (authoritative) and the browser (inline hints on blur).
/** Optional answers; an empty value means "Not sure yet". */
export const TIMELINES = ["As soon as possible", "In the next 3 months", "Later this year"] as const;

/** The answers a visitor types; each can be flagged. */
export type FieldName = "email" | "message" | "timeline";
export interface EnquiryFields extends Record<FieldName, string> {
  /** Page or button that led to the form, from a hidden field. Never flagged: a bad value is just dropped. */
  source: string;
  /** Site the visitor arrived from, from a hidden field filled in by the browser. */
  referrer: string;
}
export type EnquiryErrors = Partial<Record<FieldName, string>>;

// Hidden fields come from the browser, so anyone can send anything. Keep only short, plain values.
export const cleanSource = (raw: string | null | undefined) => {
  const v = (raw ?? "").trim();
  return /^[a-z0-9][a-z0-9:_./-]{0,79}$/i.test(v) ? v : "";
};
export const cleanReferrer = (raw: string | null | undefined) => {
  const v = (raw ?? "").trim().toLowerCase();
  return /^[a-z0-9][a-z0-9._-]{0,79}$/.test(v) ? v : "";
};
/** "home, from google.com" for the inbox and the notification email. */
export const describeSource = (e: Pick<EnquiryFields, "source" | "referrer">) =>
  [e.source, e.referrer && `from ${e.referrer}`].filter(Boolean).join(", ") || "Not known";

const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;

/** Returns what the visitor should do next, or null when the value is fine. */
export function checkField(name: FieldName, raw: string): string | null {
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
  const values: EnquiryFields = {
    email: get("email").trim(),
    message: get("message").trim(),
    timeline: get("timeline").trim(),
    source: cleanSource(get("source")),
    referrer: cleanReferrer(get("referrer")),
  };
  const errors: EnquiryErrors = {};
  for (const k of ["email", "message", "timeline"] as const satisfies readonly FieldName[]) {
    const e = checkField(k, values[k]);
    if (e) errors[k] = e;
  }
  // Real people never see the "website" field; bots fill every input they find.
  if (get("website")) return { ok: true, value: values, spam: true };
  return Object.keys(errors).length ? { ok: false, errors, values } : { ok: true, value: values, spam: false };
}
