import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { COLOUR, escapeHtml, mailto } from "./email.ts";
import { enquiryAcknowledgement, enquiryNotification } from "./enquiry-email.ts";

const at = new Date("2026-10-23T03:04:00Z");
const enquiry = { email: "a@b.co", message: "A booking app for a small dive shop in Suva.", timeline: "Later this year" };

test("email colours are the brand colours", () => {
  const css = readFileSync(new URL("../../brand/colors.css", import.meta.url), "utf8").toUpperCase();
  for (const hex of Object.values(COLOUR)) assert.ok(css.includes(hex), `${hex} is not in brand/colors.css`);
  const used = new Set(enquiryNotification(enquiry, at).html.match(/#[0-9A-F]{6}/gi)?.map((h) => h.toUpperCase()));
  for (const hex of used) assert.ok(css.includes(hex), `${hex} is not a brand colour`);
});

test("the notification carries the whole enquiry and links to reply", () => {
  const m = enquiryNotification(enquiry, at);
  assert.equal(m.subject, "New enquiry from a@b.co");
  for (const part of [enquiry.message, "Later this year", "mailto:a@b.co"]) assert.ok(m.html.includes(part), part);
  assert.ok(m.text.includes(enquiry.message) && m.text.includes("Timeline: Later this year"));
  assert.ok(m.text.includes("23 Oct 2026"));
});

test("the acknowledgement does not repeat the visitor's message", () => {
  const m = enquiryAcknowledgement({ ...enquiry, message: "Pay me at evil.example NOW" }, at, "mail@taiatiniyara.com");
  assert.equal(m.subject, "I've got your message");
  assert.ok(!m.html.includes("evil.example") && !m.text.includes("evil.example"));
  assert.ok(m.text.includes("mail@taiatiniyara.com"));
});

test("visitor text is escaped in the HTML part", () => {
  const m = enquiryNotification({ ...enquiry, message: `<script>alert(1)</script> & "quotes"\nsecond line` }, at);
  assert.ok(!m.html.includes("<script>alert"));
  assert.ok(m.html.includes("&lt;script&gt;") && m.html.includes("<br>second line"));
  assert.equal(escapeHtml(`<a href="x">&'`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
});

test("the HTML names the brand fonts and has a text twin", () => {
  const m = enquiryAcknowledgement(enquiry, at, "mail@taiatiniyara.com");
  assert.ok(m.html.includes("Dela Gothic One") && m.html.includes("Martian Mono"));
  assert.ok(m.html.includes('alt="Taia Tiniyara"'));
  assert.ok(m.text.startsWith("Thanks, I've got it."));
  assert.ok(m.text.includes("1. I read what you wrote."));
});

test("mailto keeps the @ and encodes the subject", () => {
  assert.equal(mailto("a@b.co", "Re: hi there"), "mailto:a@b.co?subject=Re%3A%20hi%20there");
});
