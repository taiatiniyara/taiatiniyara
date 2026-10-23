import { test } from "node:test";
import assert from "node:assert/strict";
import { sniff, sha256Hex } from "./media.ts";

const bytes = (s: string) => new TextEncoder().encode(s);

test("sniff trusts magic bytes only", () => {
  assert.equal(sniff(bytes("RIFF\0\0\0\0WEBPVP8 ")), "webp");
  assert.equal(sniff(bytes("GIF89a....")), "gif");
  assert.equal(sniff(bytes("<svg xmlns='http://www.w3.org/2000/svg'/>")), null);
  assert.equal(sniff(bytes("\x89PNG\r\n\x1a\n")), null);
  assert.equal(sniff(new Uint8Array(0)), null);
});

test("sha256Hex", async () => {
  assert.equal(await sha256Hex(bytes("abc").buffer as ArrayBuffer), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});
