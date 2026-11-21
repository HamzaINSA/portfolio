import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Public URL of the site, used for canonical links, social tags and the sitemap.
  // Unset until the domain is chosen (decision O1); set SITE_URL at build time once it is.
  site: process.env.SITE_URL || undefined,
});
