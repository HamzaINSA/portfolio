import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Training page', () => {
  test('has no accessibility violation', async ({ page }) => {
    await page.goto('/training');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('lists verified checkpoints in date order, then the current education', async ({
    page,
  }) => {
    await page.goto('/training');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Training run' }),
    ).toBeVisible();
    const numbers = await page.locator('article .number').allInnerTexts();
    expect(numbers).toEqual([
      'CHECKPOINT 1',
      'CHECKPOINT 2',
      'CHECKPOINT 3 · NOW',
    ]);
    const titles = await page.locator('article h2').allInnerTexts();
    expect(titles[0]).toContain('Developer and Technical Consultant');
    expect(titles[1]).toContain('Developer (Internship)');
  });

  test('marks the curve as a schematic and never shows unverified content', async ({
    page,
  }) => {
    await page.goto('/training');
    await expect(
      page.getByRole('img', { name: /not real metrics/ }).first(),
    ).toBeAttached();
    const text = await page.locator('body').innerText();
    for (const forbidden of ['[TO CONFIRM', '[SOURCE NEEDED']) {
      expect(text).not.toContain(forbidden);
    }
  });

  test('"ask about this" links carry a question for the chat', async ({
    page,
  }) => {
    await page.goto('/training');
    const href = await page
      .getByRole('link', { name: 'ask about this →' })
      .first()
      .getAttribute('href');
    expect(href).toMatch(/^\/ask\?q=What%20did%20Hamza%20do%20at%20/);
  });

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/training');
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('is marked as the current page in the navigation', async ({
    page,
    viewport,
  }) => {
    test.skip((viewport?.width ?? 0) < 768, 'desktop navigation only');
    await page.goto('/training');
    await expect(page.locator('.nav-desktop [aria-current="page"]')).toHaveText(
      'training',
    );
  });
});
