import { test } from "node:test";
import assert from "node:assert/strict";
import { articleLd, jsonLdString, socialImage } from "./seo.ts";

test("socialImage falls back to the PNG card and resizes own media", () => {
  assert.equal(socialImage(undefined), "https://taiatiniyara.com/og.png");
  const h = "a".repeat(64);
  assert.equal(socialImage(`/media/${h}.webp`), `https://taiatiniyara.com/media/${h}.webp?w=1200`);
});

test("jsonLdString can't close the script tag", () => {
  const out = jsonLdString({ headline: "</script><script>alert(1)" });
  assert.ok(!out.includes("</script"));
  assert.equal(JSON.parse(out).headline, "</script><script>alert(1)");
});

test("articleLd carries ISO dates and the canonical URL", () => {
  const ld = articleLd({ title: "T", description: "", path: "/blog/t", published: 1_700_000_000, updated: 1_700_000_100 });
  assert.equal(ld.url, "https://taiatiniyara.com/blog/t");
  assert.equal(ld.datePublished, "2023-11-14T22:13:20.000Z");
  assert.equal(ld.description, undefined);
});
