import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const cards = '#project-list > li';
const visibleCards = '#project-list > li:not([hidden])';

test.describe('Evaluation page', () => {
  test('has no accessibility violation', async ({ page }) => {
    await page.goto('/projects');
    await expect(
      page.getByRole('group', { name: /Filter projects/ }),
    ).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('lists every verified project, linking to its case study', async ({
    page,
  }) => {
    await page.goto('/projects');
    await expect(
      page.getByRole('heading', { level: 1, name: 'Evaluation' }),
    ).toBeVisible();
    await expect(page.locator(cards)).toHaveCount(4);
    const hrefs = await page
      .locator(`${cards} a`)
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs.sort()).toEqual([
      '/projects/ai-interview-prep-app',
      '/projects/jai-pige',
      '/projects/material-flow-prototype',
      '/projects/planning-documents-automation',
    ]);
  });

  test('puts "All" first and filters by topic, reflected in the URL', async ({
    page,
  }) => {
    await page.goto('/projects');
    const buttons = page
      .getByRole('group', { name: /Filter projects/ })
      .getByRole('button');
    await expect(buttons.first()).toHaveText('All');
    await expect(buttons.first()).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'mobile', exact: true }).click();
    await expect(page).toHaveURL(/\/projects\?topic=mobile$/);
    await expect(page.locator(visibleCards)).toHaveCount(1);
    await expect(
      page.getByRole('button', { name: 'mobile', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.getByRole('button', { name: 'All', exact: true }),
    ).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('status')).toHaveText('1 project shown');

    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.locator(visibleCards)).toHaveCount(4);
  });

  test('applies the topic from the URL and ignores unknown topics', async ({
    page,
  }) => {
    await page.goto('/projects?topic=privacy');
    await expect(page.locator(visibleCards)).toHaveCount(1);
    await expect(
      page.getByRole('button', { name: 'privacy', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/projects?topic=unknown');
    await expect(page.locator(visibleCards)).toHaveCount(4);
    await expect(
      page.getByRole('button', { name: 'All', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('never shows unverified content, internal notes or open questions', async ({
    page,
  }) => {
    await page.goto('/projects');
    const text = await page.locator('body').innerText();
    for (const forbidden of [
      '[TO CONFIRM',
      '[SOURCE NEEDED',
      'Sources: CV',
      'Public repository or demo link?',
    ]) {
      expect(text).not.toContain(forbidden);
    }
  });

  test('shows the frame of ETIC projects with an anonymous client', async ({
    page,
  }) => {
    await page.goto('/projects');
    await expect(
      page.getByText(
        'with ETIC INSA Technologies · for a French road-construction company',
      ),
    ).toBeVisible();
  });

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/projects');
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
    await page.goto('/projects');
    await expect(page.locator('.nav-desktop [aria-current="page"]')).toHaveText(
      'evaluation',
    );
  });
});

test.describe('Evaluation page without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows all projects and hides the filter buttons', async ({ page }) => {
    await page.goto('/projects?topic=mobile');
    await expect(page.locator(visibleCards)).toHaveCount(4);
    await expect(page.locator('[data-filter-bar]')).toBeHidden();
  });
});
