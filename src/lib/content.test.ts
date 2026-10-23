import { test } from "node:test";
import assert from "node:assert/strict";
import { renderBody, mediaKeys } from "./content.ts";

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
