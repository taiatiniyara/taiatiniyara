import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: "https://taiatiniyara.com",
  session: false, // no KV session store; auth is Cloudflare Access
  security: { checkOrigin: false }, // we check Origin ourselves in the admin middleware
  // The CSP (src/middleware.ts) allows only 'self' for scripts and fonts, so nothing may be inlined as an inline <script> or a data: font.
  vite: { build: { assetsInlineLimit: 0 } },
});
