import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const url = '/projects/planning-documents-automation';

test.describe('Project detail page', () => {
  test('has no accessibility violation', async ({ page }) => {
    await page.goto(url);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('shows the header, the client and the filled project card cells', async ({
    page,
  }) => {
    await page.goto(url);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Planning documents automation tool',
      }),
    ).toBeVisible();
    await expect(
      page.getByText('with ETIC INSA Technologies · for VINCI'),
    ).toBeVisible();
    const labels = await page.locator('.facts dt').allInnerTexts();
    expect(labels).toEqual(['task', 'data', 'method', 'my role']);
  });

  test('omits blocks without content', async ({ page }) => {
    await page.goto(url);
    for (const name of ['What worked', 'What failed', 'Next iteration']) {
      await expect(page.getByRole('heading', { name })).toHaveCount(0);
    }
    await expect(page.locator('.links')).toHaveCount(0);
    const text = await page.locator('main').innerText();
    for (const forbidden of ['[TO CONFIRM', '[SOURCE NEEDED', 'null']) {
      expect(text).not.toContain(forbidden);
    }
  });

  test('links back, to the neighbours and to the chat', async ({ page }) => {
    await page.goto(url);
    await expect(
      page.getByRole('link', { name: '← all projects' }),
    ).toHaveAttribute('href', '/projects');
    const pager = page.getByRole('navigation', { name: 'Other projects' });
    await expect(
      pager.getByRole('link', { name: /PREVIOUS PROJECT/ }),
    ).toHaveAttribute('href', /^\/projects\/[a-z0-9-]+$/);
    const ask = await pager
      .getByRole('link', { name: 'ASK ABOUT THIS PROJECT →' })
      .getAttribute('href');
    expect(ask).toBe(
      `/ask?q=${encodeURIComponent('Tell me about the project Planning documents automation tool.')}`,
    );
  });

  test('every card on the Evaluation page opens its detail page', async ({
    page,
  }) => {
    await page.goto('/projects');
    const hrefs = await page
      .locator('#project-list a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    for (const href of hrefs) {
      const response = await page.goto(href ?? '');
      expect(response?.status(), href ?? '').toBe(200);
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto(url);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
