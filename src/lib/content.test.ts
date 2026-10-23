import { test } from "node:test";
import assert from "node:assert/strict";
import { renderBody, mediaKeys, headings, readingMinutes } from "./content.ts";

const h = "b".repeat(64);
const doc = {
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Hi <b>" }] },
    { type: "paragraph", content: [
      { type: "text", text: "bad", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] },
      { type: "text", text: "good", marks: [{ type: "link", attrs: { href: "https://a.com" } }] },
    ] },
    { type: "image", attrs: { src: `/media/${h}.webp`, alt: "x", caption: "cap" } },
    { type: "image", attrs: { src: "https://evil.com/x.png" } },
  ],
};

test("renderBody escapes text, drops bad links, limits images to own media", () => {
  const html = renderBody(doc);
  assert.match(html, /Hi &lt;b&gt;/);
  assert.doesNotMatch(html, /javascript:/);
  assert.match(html, /href="https:\/\/a\.com"[^>]*target="_blank"/);
  assert.ok(html.includes(`srcset="/media/${h}.webp?w=480 480w`));
  assert.match(html, /<figcaption>cap<\/figcaption>/);
  assert.doesNotMatch(html, /evil\.com/);
});

test("mediaKeys finds only own media", () => {
  assert.deepEqual([...mediaKeys(doc)], [`media/${h}.webp`]);
});

const h2 = (text: string) => ({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text }] });
const para = (text: string) => ({ type: "paragraph", content: [{ type: "text", text }] });

test("headings get unique ids and a link to themselves", () => {
  const d = { type: "doc", content: [h2("Why it matters"), para("x"), h2("Why it matters"), h2("<b>")] };
  assert.deepEqual(headings(d).map((h) => h.id), ["why-it-matters", "why-it-matters-2", "b"]);
  const html = renderBody(d);
  assert.match(html, /<h2 id="why-it-matters">Why it matters <a class="anchor" href="#why-it-matters" aria-label="Link to Why it matters">#<\/a><\/h2>/);
  assert.match(html, /<h2 id="why-it-matters-2">/);
  assert.doesNotMatch(html, /aria-label="Link to <b>"/);
});

test("reading time rounds to the nearest minute and is never zero", () => {
  assert.equal(readingMinutes({ type: "doc", content: [para("a few words")] }), 1);
  assert.equal(readingMinutes({ type: "doc", content: [para("word ".repeat(700))] }), 4);
});
