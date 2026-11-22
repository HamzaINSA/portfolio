import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { profileSchema } from '../../src/lib/content/schemas';
import {
  absoluteUrl,
  canonicalPath,
  homeDescription,
  personJsonLd,
  robotsTxt,
  serialiseJsonLd,
  sitemapXml,
  sitePaths,
} from '../../src/lib/seo/meta';

const profile = profileSchema.parse(
  JSON.parse(readFileSync(join(process.cwd(), 'content/profile.json'), 'utf8')),
);
const SITE = 'https://example.dev';

describe('absoluteUrl', () => {
  it('joins a path to the site URL', () => {
    expect(absoluteUrl('/about', SITE)).toBe('https://example.dev/about');
  });
  it('returns null while the site URL is unknown', () => {
    expect(absoluteUrl('/about', undefined)).toBeNull();
  });
});

describe('canonicalPath', () => {
  it('drops the trailing slash, except for the root', () => {
    expect(canonicalPath('/about/')).toBe('/about');
    expect(canonicalPath('/projects/a')).toBe('/projects/a');
    expect(canonicalPath('/')).toBe('/');
  });
});

describe('homeDescription', () => {
  it('is built from profile facts only', () => {
    const text = homeDescription(profile);
    expect(text).toContain(profile.name);
    expect(text).toContain(profile.school);
    expect(text).toContain(profile.seeking.role);
    expect(text).toContain('May 2027');
  });
  it('stays short enough for search results', () => {
    expect(homeDescription(profile).length).toBeLessThanOrEqual(200);
  });
});

describe('personJsonLd', () => {
  it('holds public facts and links, never contact details', () => {
    const data = personJsonLd(profile, SITE);
    expect(data).toMatchObject({
      '@type': 'Person',
      name: profile.name,
      url: 'https://example.dev/',
      sameAs: [profile.links.github, profile.links.linkedin],
    });
    const json = JSON.stringify(data);
    expect(json).not.toContain('@insa-lyon.fr');
    expect(json).not.toMatch(/telephone|address|email/i);
  });
  it('leaves out the url while the site URL is unknown', () => {
    expect(personJsonLd(profile, undefined)).not.toHaveProperty('url');
  });
});

describe('serialiseJsonLd', () => {
  it('cannot close the script tag', () => {
    expect(serialiseJsonLd({ name: '</script><b>' })).not.toContain(
      '</script>',
    );
  });
});

describe('sitemap and robots', () => {
  const paths = sitePaths(['a', 'b']);

  it('lists the pages and the published projects, not the 404 page', () => {
    expect(paths).toEqual([
      '/',
      '/training',
      '/projects',
      '/projects/a',
      '/projects/b',
      '/about',
      '/ask',
      '/legal',
    ]);
  });
  it('writes absolute locations', () => {
    const xml = sitemapXml(paths, SITE);
    expect(xml).toContain('<loc>https://example.dev/projects/a</loc>');
    expect(xml.match(/<url>/g)).toHaveLength(paths.length);
  });
  it('writes an empty sitemap while the site URL is unknown', () => {
    expect(sitemapXml(paths, undefined)).not.toContain('<url>');
  });
  it('points robots.txt to the sitemap only when the site URL is known', () => {
    expect(robotsTxt(SITE)).toContain(
      'Sitemap: https://example.dev/sitemap.xml',
    );
    expect(robotsTxt(undefined)).not.toContain('Sitemap');
    expect(robotsTxt(undefined)).toContain('Allow: /');
  });
});
