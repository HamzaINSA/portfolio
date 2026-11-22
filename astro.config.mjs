import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  // Public URL of the site, used for canonical links, social tags and the sitemap.
  // Set SITE_URL at build time (Cloudflare Pages project settings, decision O1).
  site: process.env.SITE_URL || undefined,
  security: {
    // Content Security Policy as a <meta> tag on every page. Astro adds hashes of its inline scripts
    // and styles to script-src and style-src; everything else may only come from the site itself.
    // connect-src 'none': the site, including the chatbot, never makes a network request (rule 3).
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self'",
        "font-src 'self'",
        "connect-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
      ],
    },
  },
});
