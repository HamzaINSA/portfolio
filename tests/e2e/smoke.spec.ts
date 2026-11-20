import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('placeholder page loads and has no accessibility violation', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
