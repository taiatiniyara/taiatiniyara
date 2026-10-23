import { test } from "node:test";
import assert from "node:assert/strict";
import { SignJWT, generateKeyPair } from "jose";
import { verifyAccessJwt } from "./auth.ts";

const cfg = { teamDomain: "team.cloudflareaccess.com", aud: "AUD", email: "me@x.com" };
const { publicKey, privateKey } = await generateKeyPair("RS256");
const other = await generateKeyPair("RS256");

const sign = (claims: Record<string, unknown>, o: { aud?: string; iss?: string; exp?: string; key?: typeof privateKey } = {}) =>
  new SignJWT(claims)
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(o.iss ?? `https://${cfg.teamDomain}`)
    .setAudience(o.aud ?? cfg.aud)
    .setExpirationTime(o.exp ?? "5m")
    .sign(o.key ?? privateKey);

test("accepts a valid token for the admin", async () => {
  assert.ok(await verifyAccessJwt(await sign({ email: "ME@x.com" }), cfg, publicKey));
});

test("without a configured aud, still checks signature, issuer, expiry and email", async () => {
  const noAud = { ...cfg, aud: undefined };
  assert.ok(await verifyAccessJwt(await sign({ email: "me@x.com" }, { aud: "anything" }), noAud, publicKey));
  assert.ok(!(await verifyAccessJwt(await sign({ email: "evil@x.com" }), noAud, publicKey)), "wrong email");
  assert.ok(!(await verifyAccessJwt(await sign({ email: "me@x.com" }, { iss: "https://evil.com" }), noAud, publicKey)), "wrong iss");
  assert.ok(!(await verifyAccessJwt(await sign({ email: "me@x.com" }, { key: other.privateKey }), noAud, publicKey)), "wrong signature");
});

test("rejects everything else", async () => {
  assert.ok(!(await verifyAccessJwt(undefined, cfg, publicKey)));
  assert.ok(!(await verifyAccessJwt("garbage", cfg, publicKey)));
  assert.ok(!(await verifyAccessJwt(await sign({ email: "evil@x.com" }), cfg, publicKey)), "wrong email");
  assert.ok(!(await verifyAccessJwt(await sign({}), cfg, publicKey)), "no email");
  assert.ok(!(await verifyAccessJwt(await sign({ email: "me@x.com" }, { aud: "other" }), cfg, publicKey)), "wrong aud");
  assert.ok(!(await verifyAccessJwt(await sign({ email: "me@x.com" }, { iss: "https://evil.com" }), cfg, publicKey)), "wrong iss");
  assert.ok(!(await verifyAccessJwt(await sign({ email: "me@x.com" }, { key: other.privateKey }), cfg, publicKey)), "wrong signature");
  assert.ok(!(await verifyAccessJwt(await sign({ email: "me@x.com" }, { exp: "-1m" }), cfg, publicKey)), "expired");
});
