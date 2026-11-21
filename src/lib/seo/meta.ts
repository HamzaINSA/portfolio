import { formatMonth } from '../format/dates';
import type { Profile } from '../content/types';

// Pure helpers for page metadata (feature F9). The site URL is unknown until the domain is chosen
// (decision O1): every helper that needs an absolute URL returns null or skips the field without it.

/** "/about" + "https://example.dev" -> "https://example.dev/about". Null when the site URL is unknown. */
export function absoluteUrl(
  path: string,
  site: URL | string | undefined,
): string | null {
  if (!site) return null;
  return new URL(path, site).href;
}

/** "/about/" -> "/about", "/" stays "/". Matches the links in the nav and the sitemap. */
export function canonicalPath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

/** Home description, built only from content/profile.json. */
export function homeDescription(profile: Profile): string {
  const { name, headline, school, yearLabel, seeking } = profile;
  return `${name}: ${headline} at ${school} (${yearLabel}). Looking for an ${seeking.role}, ${seeking.duration}, from ${formatMonth(seeking.start)}.`;
}

/**
 * schema.org Person for the Home page. Public facts only: no email, phone or address (rule 3, feature F9).
 * The email is already on the contact section; keeping it out of structured data limits scraping.
 */
export function personJsonLd(
  profile: Profile,
  site: URL | string | undefined,
): Record<string, unknown> {
  const url = absoluteUrl('/', site);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    affiliation: { '@type': 'CollegeOrUniversity', name: profile.school },
    sameAs: [profile.links.github, profile.links.linkedin],
    ...(url ? { url } : {}),
  };
}

/** JSON for a <script type="application/ld+json">, with "<" escaped so the text can never close the tag. */
export function serialiseJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** sitemap.xml for the given paths. Empty urlset when the site URL is unknown (locations must be absolute). */
export function sitemapXml(
  paths: string[],
  site: URL | string | undefined,
): string {
  const urls = site
    ? paths.map(
        (path) =>
          `  <url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`,
      )
    : [];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

/** robots.txt: everything is public; the sitemap line needs the site URL. */
export function robotsTxt(site: URL | string | undefined): string {
  const lines = ['User-agent: *', 'Allow: /'];
  const sitemap = absoluteUrl('/sitemap.xml', site);
  if (sitemap) lines.push('', `Sitemap: ${sitemap}`);
  return `${lines.join('\n')}\n`;
}

/** Every indexable page: static pages plus one per published project. The 404 page is left out. */
export function sitePaths(projectIds: string[]): string[] {
  return [
    '/',
    '/training',
    '/projects',
    ...projectIds.map((id) => `/projects/${id}`),
    '/about',
    '/ask',
  ];
}
