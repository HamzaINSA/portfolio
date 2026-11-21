import { expect, test } from '@playwright/test';

const PAGES = ['/', '/training', '/projects', '/about', '/ask'];

test.describe('SEO metadata', () => {
  for (const path of PAGES) {
    test(`${path} has a title, a description and social tags`, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/Hamza Bencheikh/);
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description?.length).toBeGreaterThan(30);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        'content',
        /Hamza Bencheikh/,
      );
      await expect(
        page.locator('meta[property="og:description"]'),
      ).toHaveAttribute('content', description ?? '');
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    });
  }

  test('each project page uses its own summary', async ({ page }) => {
    await page.goto('/projects');
    const href = await page
      .locator('a[href^="/projects/"]')
      .first()
      .getAttribute('href');
    await page.goto(href ?? '/projects');
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(description).not.toBe('');
    expect(await page.locator('body').innerText()).toContain(description);
  });

  test('Home describes the person in JSON-LD, without contact details', async ({
    page,
  }) => {
    await page.goto('/');
    const json = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const data = JSON.parse(json ?? '{}') as Record<string, unknown>;
    expect(data['@type']).toBe('Person');
    expect(data['name']).toBe('Hamza Bencheikh');
    expect(json).not.toMatch(/email|telephone|address/i);
  });

  test('the 404 page is kept out of search results', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex',
    );
  });

  test('robots.txt, sitemap.xml and the social image are served', async ({
    request,
  }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBe(true);
    expect(await robots.text()).toContain('User-agent: *');
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain('<urlset');
    const image = await request.get('/og.png');
    expect(image.ok()).toBe(true);
    expect(image.headers()['content-type']).toBe('image/png');
  });
});
