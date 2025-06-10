import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://blog.dotmavriq.life",     // required for sitemap & canonical
  integrations: [mdx()],
  output: "static",
  experimental: { viewTransitions: true }, // smooth page‑to‑page fade
  build: {
    format: "file",                        // keeps /about/index.html pattern
  },
});
