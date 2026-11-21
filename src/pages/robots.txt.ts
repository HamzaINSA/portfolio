import type { APIRoute } from 'astro';
import { robotsTxt } from '../lib/seo/meta';

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(site), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
