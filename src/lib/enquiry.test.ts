import { test } from "node:test";
import assert from "node:assert/strict";
import { checkField, cleanReferrer, cleanSource, describeSource, parseEnquiry } from "./enquiry.ts";

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

test("source and referrer are kept when plain and dropped when not", () => {
  const r = parseEnquiry(form({ ...good, source: "offer-launch", referrer: "Google.com" }));
  assert.ok(r.ok && r.value.source === "offer-launch" && r.value.referrer === "google.com");
  const bad = parseEnquiry(form({ ...good, source: "<script>", referrer: "https://x.example/?q=1" }));
  assert.ok(bad.ok && bad.value.source === "" && bad.value.referrer === "");
});

test("a bad source never blocks an enquiry", () => {
  assert.ok(parseEnquiry(form({ ...good, source: "x".repeat(500) })).ok);
  assert.equal(cleanSource("x".repeat(81)), "");
  assert.equal(cleanSource("post:my-slug"), "post:my-slug");
  assert.equal(cleanReferrer("t.co"), "t.co");
  assert.equal(cleanReferrer(null), "");
});

test("describeSource reads naturally", () => {
  assert.equal(describeSource({ source: "home", referrer: "google.com" }), "home, from google.com");
  assert.equal(describeSource({ source: "", referrer: "direct" }), "from direct");
  assert.equal(describeSource({ source: "", referrer: "" }), "Not known");
});
