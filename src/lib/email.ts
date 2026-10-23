// Branded transactional email: one content shape in, matching HTML and plain text out.
// Email clients ignore CSS variables and most of modern CSS, so the HTML is table layout with inline styles.
// The colours are the brand hex values from brand/colors.css (email.test.ts checks they still match).
import { SITE } from "./seo.ts";

export const COLOUR = {
  neon: "#05FF00",
  blue: "#003F57",
  lagoon: "#00D4FF",
  ink: "#00212E",
  mist: "#F2F7F5",
} as const;

export interface EmailLink {
  label: string;
  href: string;
}

export interface EmailContent {
  subject: string;
  /** The grey line mail apps show beside the subject. */
  preheader: string;
  /** Dela Gothic One, 8 words or fewer. */
  heading: string;
  /** One phrase from `heading`, set on a Lagoon block. */
  highlight?: string;
  intro: string[];
  /** Ruled label and value rows. A value with `href` is a link. */
  details?: { label: string; value: string; href?: string }[];
  /** The visitor's own words, on an Ink surface. */
  quote?: { label: string; text: string };
  steps?: { title: string; items: string[] };
  /** First one is the primary (Neon) button, the rest are secondary. */
  actions?: EmailLink[];
  outro?: string[];
  footer: string[];
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** A mailto: link that survives odd characters in the address or subject. */
export const mailto = (address: string, subject?: string) =>
  `mailto:${encodeURIComponent(address).replace("%40", "@")}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

const MONO = `'Martian Mono','Martian Mono Variable',ui-monospace,'Cascadia Mono',Menlo,Consolas,'Courier New',monospace`;
const DELA = `'Dela Gothic One',Impact,'Arial Black',sans-serif`;
const FONT_URL = `${SITE}/email/fonts`;

const text = (size: number, extra = "") => `margin:0;font-family:${MONO};font-size:${size}px;line-height:1.75;color:${COLOUR.mist};${extra}`;
const link = `color:${COLOUR.neon};text-decoration:underline;`;
const nl2br = (s: string) => escapeHtml(s).replace(/\r?\n/g, "<br>");

function headingHtml(heading: string, highlight?: string) {
  const at = highlight ? heading.indexOf(highlight) : -1;
  if (!highlight || at < 0) return escapeHtml(heading);
  const block = `background-color:${COLOUR.lagoon};color:${COLOUR.ink};padding:0 8px;`;
  return `${escapeHtml(heading.slice(0, at))}<span style="${block}">${escapeHtml(highlight)}</span>${escapeHtml(heading.slice(at + highlight.length))}`;
}

function buttonHtml({ label, href }: EmailLink, primary: boolean) {
  const fill = primary ? `bgcolor="${COLOUR.neon}" style="background-color:${COLOUR.neon};"` : `style="border:2px solid ${COLOUR.mist};"`;
  const colour = primary ? COLOUR.ink : COLOUR.mist;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 16px 16px 0;"><tr>
<td ${fill}><a href="${escapeHtml(href)}" style="display:block;padding:12px 24px;min-height:20px;font-family:${MONO};font-size:16px;line-height:20px;font-weight:700;color:${colour};text-decoration:none;">${escapeHtml(label)}</a></td>
</tr></table>`;
}

function htmlBody(c: EmailContent) {
  const para = (p: string) => `<p style="${text(14, "margin-bottom:24px;")}">${nl2br(p)}</p>`;
  const details = c.details?.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;border-top:1px solid ${COLOUR.mist};">${c.details
        .map(
          (d) => `<tr>
<td width="104" valign="top" style="padding:16px 16px 16px 0;border-bottom:1px solid ${COLOUR.mist};${text(14, "font-weight:800;")}">${escapeHtml(d.label)}</td>
<td valign="top" style="padding:16px 0;border-bottom:1px solid ${COLOUR.mist};${text(14, "word-break:break-word;")}">${
            d.href ? `<a href="${escapeHtml(d.href)}" style="${link}">${escapeHtml(d.value)}</a>` : escapeHtml(d.value)
          }</td>
</tr>`,
        )
        .join("")}</table>`
    : "";
  const quote = c.quote
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;"><tr><td bgcolor="${COLOUR.ink}" style="background-color:${COLOUR.ink};padding:24px;">
<p style="${text(14, "font-weight:800;margin-bottom:8px;")}">${escapeHtml(c.quote.label)}</p>
<p style="${text(14, "word-break:break-word;")}">${nl2br(c.quote.text)}</p>
</td></tr></table>`
    : "";
  const steps = c.steps
    ? `<h2 style="margin:0 0 16px;font-family:${DELA};font-weight:400;font-size:24px;line-height:1.05;color:${COLOUR.mist};">${escapeHtml(c.steps.title)}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">${c.steps.items
        .map(
          (s, i) => `<tr>
<td width="32" valign="top" style="padding:0 0 8px;${text(14, "font-weight:800;")}">${i + 1}.</td>
<td valign="top" style="padding:0 0 8px;${text(14)}">${escapeHtml(s)}</td>
</tr>`,
        )
        .join("")}</table>`
    : "";
  const actions = c.actions?.length ? `<div style="margin:0 0 16px;">${c.actions.map((a, i) => buttonHtml(a, i === 0)).join("")}</div>` : "";
  return `${c.intro.map(para).join("")}${details}${quote}${steps}${actions}${(c.outro ?? []).map(para).join("")}`;
}

export function renderEmail(c: EmailContent): RenderedEmail {
  const pad = "&nbsp;&zwnj;".repeat(60); // stops the body text showing up in the preview line
  const html = `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<meta name="x-apple-disable-message-reformatting">
<title>${escapeHtml(c.subject)}</title>
<style>
@font-face{font-family:'Dela Gothic One';font-weight:400;font-style:normal;src:url(${FONT_URL}/dela-gothic-one.woff2) format('woff2');}
@font-face{font-family:'Martian Mono';font-weight:300 800;font-style:normal;src:url(${FONT_URL}/martian-mono.woff2) format('woff2');}
:root{color-scheme:dark;supported-color-schemes:dark;}
body{margin:0;padding:0;background-color:${COLOUR.ink};}
a{overflow-wrap:anywhere;}
@media (max-width:40rem){.pad{padding:32px 24px !important;}}
</style>
</head>
<body bgcolor="${COLOUR.ink}" style="margin:0;padding:0;background-color:${COLOUR.ink};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${COLOUR.ink};">${escapeHtml(c.preheader)}${pad}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOUR.ink}" style="background-color:${COLOUR.ink};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
<tr><td bgcolor="${COLOUR.blue}" style="background-color:${COLOUR.blue};line-height:0;font-size:0;"><a href="${SITE}"><img src="${SITE}/email/mark.png" width="120" height="60" alt="Taia Tiniyara" style="display:block;border:0;width:120px;height:60px;"></a></td></tr>
<tr><td class="pad" bgcolor="${COLOUR.blue}" style="background-color:${COLOUR.blue};padding:48px 40px 32px;">
<h1 style="margin:0 0 32px;font-family:${DELA};font-weight:400;font-size:32px;line-height:1.15;color:${COLOUR.mist};">${headingHtml(c.heading, c.highlight)}</h1>
${htmlBody(c)}
</td></tr>
<tr><td class="pad" style="padding:32px 40px;">
${c.footer.map((f) => `<p style="${text(14, "margin-bottom:8px;")}">${nl2br(f)}</p>`).join("\n")}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const lines: string[] = [c.heading, "", ...c.intro.flatMap((p) => [p, ""])];
  if (c.details?.length) lines.push(...c.details.map((d) => `${d.label}: ${d.href && d.href !== `mailto:${d.value}` ? `${d.value} (${d.href})` : d.value}`), "");
  if (c.quote) lines.push(`${c.quote.label}:`, c.quote.text, "");
  if (c.steps) lines.push(`${c.steps.title}`, ...c.steps.items.map((s, i) => `${i + 1}. ${s}`), "");
  if (c.actions?.length) lines.push(...c.actions.map((a) => `${a.label}: ${a.href}`), "");
  for (const p of c.outro ?? []) lines.push(p, "");
  lines.push("--", ...c.footer);
  return { subject: c.subject, html, text: `${lines.join("\n")}\n` };
}
