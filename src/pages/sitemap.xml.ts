import type { APIRoute } from 'astro';
import { getProjects } from '../lib/content';
import { publishedProjects } from '../lib/content/select';
import { sitemapXml, sitePaths } from '../lib/seo/meta';

export const GET: APIRoute = async ({ site }) => {
  const ids = publishedProjects(await getProjects()).map((p) => p.id);
  return new Response(sitemapXml(sitePaths(ids), site), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
