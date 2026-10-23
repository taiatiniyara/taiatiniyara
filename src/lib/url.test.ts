import { test } from "node:test";
import assert from "node:assert/strict";
import { safeUrl, MEDIA_PATH, sameOrigin } from "./url.ts";
import { slugify, isSlug } from "./slug.ts";

test("safeUrl allows web, mail and relative; drops the rest", () => {
  for (const ok of ["https://a.com", "http://a.com/x?y=1", "mailto:a@b.com", "/blog/x"]) assert.ok(safeUrl(ok), ok);
  for (const bad of ["javascript:alert(1)", " javascript:alert(1)", "data:text/html,x", "//evil.com", "/\\evil.com", "foo/bar", "", null, undefined])
    assert.ok(!safeUrl(bad), String(bad));
});

test("MEDIA_PATH only matches hashed own media", () => {
  const h = "a".repeat(64);
  assert.ok(MEDIA_PATH.test(`/media/${h}.webp`));
  assert.ok(!MEDIA_PATH.test(`/media/${h}.svg`));
  assert.ok(!MEDIA_PATH.test(`https://evil.com/media/${h}.webp`));
  assert.ok(!MEDIA_PATH.test(`/media/../${h}.webp`));
});

test("slugify", () => {
  assert.equal(slugify("  Héllo, World! "), "hello-world");
  assert.ok(isSlug(slugify("My 1st post")));
  assert.ok(!isSlug("Bad Slug"));
});

test("sameOrigin trusts Origin, then Sec-Fetch-Site, and nothing else", () => {
  const req = (h: Record<string, string>) => new Request("https://a.com/contact", { method: "POST", headers: h });
  assert.ok(sameOrigin(req({ Origin: "https://a.com" }), "https://a.com"));
  assert.ok(!sameOrigin(req({ Origin: "https://evil.com" }), "https://a.com"));
  assert.ok(!sameOrigin(req({ Origin: "https://evil.com", "Sec-Fetch-Site": "same-origin" }), "https://a.com"));
  assert.ok(sameOrigin(req({ "Sec-Fetch-Site": "same-origin" }), "https://a.com"));
  assert.ok(!sameOrigin(req({}), "https://a.com"));
});
