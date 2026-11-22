import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Never click the email link here: it opens the Mail app on the developer's machine.
test.describe('Legal and privacy page', () => {
  test('has no accessibility violation', async ({ page }) => {
    await page.goto('/legal');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('names the publisher, the contact address and the privacy rules', async ({
    page,
  }) => {
    await page.goto('/legal');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Legal notice and privacy',
    );
    await expect(
      page.getByRole('heading', { name: 'Publisher' }),
    ).toBeVisible();
    await expect(page.locator('main')).toContainText('Hamza Bencheikh');
    await expect(
      page.locator('main a[href^="mailto:"]').first(),
    ).toHaveAttribute('href', /^mailto:.+@.+/);
    for (const name of ['Privacy', 'Ask the model', 'Contact form']) {
      await expect(
        page.getByRole('heading', { name, exact: true }),
      ).toBeVisible();
    }
    await expect(page.locator('main')).toContainText('no cookies');
  });

  test('is linked from the footer of every page', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('contentinfo').getByRole('link', {
      name: 'Legal & privacy',
    });
    await expect(link).toHaveAttribute('href', '/legal');
  });

  test('never shows a placeholder or a phone number', async ({ page }) => {
    await page.goto('/legal');
    const text = await page.locator('main').innerText();
    expect(text).not.toContain('[TO CONFIRM');
    expect(text).not.toMatch(/\+33/);
  });

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/legal');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});
