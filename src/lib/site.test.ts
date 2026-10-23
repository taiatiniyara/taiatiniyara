import { test } from "node:test";
import assert from "node:assert/strict";
import { CHANNELS, OFFERS, channels, contactHref, priceLabel } from "./site.ts";

const none = { booking: "", whatsapp: "", messenger: "" };

test("channels not set are not shown", () => {
  assert.deepEqual(channels(none), []);
});

test("channels build safe links and skip bad values", () => {
  const c = channels({ booking: "https://cal.com/taia/intro", whatsapp: "+679 123-4567", messenger: "taia.tiniyara" });
  assert.deepEqual(c.map((x) => x.href), ["https://cal.com/taia/intro", "https://wa.me/6791234567", "https://m.me/taia.tiniyara"]);
  assert.deepEqual(channels({ booking: "javascript:alert(1)", whatsapp: "12", messenger: "a b/c" }), []);
  assert.deepEqual(channels({ ...none, booking: "http://cal.com/x" }), []);
});

test("the shipped config is valid", () => {
  channels(CHANNELS);
  assert.ok(OFFERS.length >= 2 && new Set(OFFERS.map((o) => o.id)).size === OFFERS.length);
});

test("an offer without a price asks for a quote", () => {
  assert.equal(priceLabel({ from: null }), "Ask for a quote");
  assert.equal(priceLabel({ from: "FJD 8,000" }), "From FJD 8,000");
});

test("contactHref encodes where the visitor came from", () => {
  assert.equal(contactHref("post:a b"), "/contact?from=post%3Aa%20b");
});
