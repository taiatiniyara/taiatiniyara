import { test } from "node:test";
import assert from "node:assert/strict";
import { checkField, parseEnquiry } from "./enquiry.ts";

const form = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};
const good = { email: "a@b.co", message: "A booking app for a small dive shop in Suva.", timeline: "Later this year" };

test("accepts a complete enquiry and trims it", () => {
  const r = parseEnquiry(form({ ...good, email: "  a@b.co " }));
  assert.ok(r.ok && !r.spam);
  assert.equal(r.ok && r.value.email, "a@b.co");
});

test("timeline is optional but must be one of the options", () => {
  assert.ok(parseEnquiry(form({ ...good, timeline: "" })).ok);
  assert.equal(checkField("timeline", "whenever"), "Choose one of the options.");
});

test("errors say what to do", () => {
  const r = parseEnquiry(form({ email: "nope", message: "hi", timeline: "" }));
  assert.ok(!r.ok);
  assert.match(!r.ok ? r.errors.email! : "", /name@site\.com/);
  assert.match(!r.ok ? r.errors.message! : "", /what you're building/);
});

test("a filled honeypot passes quietly as spam", () => {
  const r = parseEnquiry(form({ ...good, website: "http://spam.example" }));
  assert.ok(r.ok && r.spam);
});

test("message length is capped", () => {
  assert.ok(checkField("message", "x".repeat(2001)));
  assert.equal(checkField("message", "x".repeat(2000)), null);
});
