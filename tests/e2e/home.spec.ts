import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Home', () => {
  test('has no accessibility violation', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('shows the key information from content/', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'hamza',
    );
    await expect(
      page.getByText('AVAILABLE FOR INTERNSHIP').first(),
    ).toBeVisible();
    await expect(page.getByText('May 2027 · up to 4 months')).toBeVisible();
  });

  test('never shows unverified content', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('body').innerText();
    for (const forbidden of ['[TO CONFIRM', '[SOURCE NEEDED']) {
      expect(text).not.toContain(forbidden);
    }
  });

  test('makes no request outside its own origin', async ({ page, baseURL }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      if (
        !request.url().startsWith(baseURL ?? '') &&
        !request.url().startsWith('data:')
      ) {
        external.push(request.url());
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(external).toEqual([]);
  });

  test('skip link moves focus to the main content', async ({
    page,
    browserName,
  }) => {
    await page.goto('/');
    // Safari on macOS reaches links with Option+Tab only (system default), not with Tab.
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe('Mobile menu', () => {
  test.skip(
    ({ viewport }) => (viewport?.width ?? 1000) >= 768,
    'phone layout only',
  );

  test('opens, closes with Escape and returns focus to its button', async ({
    page,
  }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Open menu' });
    await button.click();
    const dialog = page.getByRole('dialog', { name: 'Menu' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'training' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(button).toBeFocused();
  });

  test('closes with its close button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.getByRole('button', { name: 'Close menu' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('has no accessibility violation while open', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test('has no horizontal scroll', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('404 page is served with the layout', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Page not found' }),
  ).toBeVisible();
});
