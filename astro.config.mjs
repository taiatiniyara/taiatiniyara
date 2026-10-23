import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  site: "https://taiatiniyara.com",
  session: false, // no KV session store; auth is Cloudflare Access
  security: { checkOrigin: false }, // we check Origin ourselves in the admin middleware
});
