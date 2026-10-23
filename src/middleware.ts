import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { isAdmin } from "./lib/auth.ts";
import { TTL } from "./lib/cache.ts";
import { SITE } from "./lib/seo.ts";

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const isAdminPath = (p: string) => p === "/admin" || p.startsWith("/admin/") || p.startsWith("/api/admin/");
const deny = (status: number, msg: string) => new Response(msg, { status, headers: { "Cache-Control": "no-store" } });

export const onRequest = defineMiddleware(async ({ request, url, locals }, next) => {
  const admin = isAdminPath(url.pathname);

  // One host per page: send www to the apex so search engines don't split the site across two.
  if (url.hostname === `www.${new URL(SITE).hostname}`) return Response.redirect(`${SITE}${url.pathname}${url.search}`, 301);

  // The Access path is "admin/*", which doesn't match a bare "/admin", so send it where Access applies.
  if (url.pathname === "/admin") return Response.redirect(`${url.origin}/admin/`, 302);

  if (admin) {
    if (!(await isAdmin(request, env))) return deny(403, "Forbidden");
    if (!["GET", "HEAD"].includes(request.method)) {
      // Access uses a cookie, so mutating requests must come from our own origin and be JSON/multipart.
      if (request.headers.get("Origin") !== url.origin) return deny(403, "Bad origin");
      const type = request.headers.get("Content-Type") ?? "";
      if (!type.startsWith("application/json") && !type.startsWith("multipart/form-data")) return deny(415, "Unsupported type");
    }
  }

  // Public HTML/XML pages: serve from the edge cache for TTL seconds.
  const cacheable = !admin && request.method === "GET" && !url.pathname.startsWith("/api/") && !url.pathname.startsWith("/media/") && url.hostname !== "localhost";
  if (cacheable) {
    const hit = await caches.default.match(request);
    if (hit) return hit;
  }

  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set("Content-Security-Policy", CSP);
  out.headers.set("X-Content-Type-Options", "nosniff");
  out.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (admin) out.headers.set("Cache-Control", "no-store");
  else if (cacheable && res.status === 200 && !out.headers.has("Cache-Control")) {
    out.headers.set("Cache-Control", `public, max-age=${TTL}`);
    locals.cfContext.waitUntil(caches.default.put(request, out.clone()));
  }
  return out;
});
