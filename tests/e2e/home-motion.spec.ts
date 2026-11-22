import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PARTNERS = [
  'Delta Quest',
  'ETIC INSA Technologies',
  'VINCI',
  'Inddigo',
  'Georges Besse Foundation',
  'Propulseo',
  'INSA Lyon',
];

test.describe('Home logo strip', () => {
  test('lists every organisation once for assistive technologies', async ({
    page,
  }) => {
    await page.goto('/');
    const strip = page.getByRole('region', { name: 'worked with & backed by' });
    for (const name of PARTNERS) {
      await expect(strip.getByRole('img', { name, exact: true })).toHaveCount(
        1,
      );
    }
  });

  test('moves, and the PAUSE button stops it', async ({ page }) => {
    await page.goto('/');
    const strip = page.locator('[data-partners]');
    await expect(strip).toHaveClass(/is-moving/);
    const pause = strip.getByRole('button', { name: 'PAUSE' });
    await pause.click();
    await expect(strip).toHaveClass(/is-paused/);
    const play = strip.getByRole('button', { name: 'PLAY' });
    await expect(play).toHaveAttribute('aria-pressed', 'true');
    const state = await strip
      .locator('.track')
      .evaluate((el) => getComputedStyle(el).animationPlayState);
    expect(state).toBe('paused');
  });

  test('loads its logos from the site itself', async ({ page, baseURL }) => {
    await page.goto('/');
    const sources = await page
      .locator('[data-partners] img')
      .evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
    for (const src of sources) expect(src.startsWith(baseURL ?? '')).toBe(true);
  });
});

test.describe('Home training run', () => {
  test('shows one checkpoint at a time, chosen with the buttons', async ({
    page,
  }) => {
    await page.goto('/');
    const section = page.locator('[data-training]');
    const picker = section.getByRole('group', { name: 'Choose a checkpoint' });
    const buttons = picker.getByRole('button');
    const last = buttons.last();
    await expect(last).toHaveAttribute('aria-pressed', 'true');
    await expect(section.locator('.checkpoints > li:visible')).toHaveCount(1);
    await expect(section.locator('.checkpoints > li:visible')).toContainText(
      'Next run:',
    );

    await buttons.first().focus();
    await page.keyboard.press('Enter');
    await expect(buttons.first()).toHaveAttribute('aria-pressed', 'true');
    await expect(last).toHaveAttribute('aria-pressed', 'false');
    await expect(section.locator('.checkpoints > li:visible')).toContainText(
      'ETIC INSA Technologies',
    );
  });

  test('draws the curve when the section is seen', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('[data-training]');
    await expect(section).toHaveClass(/is-armed/);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveClass(/is-drawn/);
  });

  test('has no accessibility violation after a choice', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('group', { name: 'Choose a checkpoint' })
      .getByRole('button')
      .nth(1)
      .click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe('Home with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('the logos stand still and the curve is drawn at once', async ({
    page,
  }) => {
    await page.goto('/');
    const strip = page.locator('[data-partners]');
    await expect(strip).not.toHaveClass(/is-moving/);
    await expect(strip.getByRole('button')).toBeHidden();
    await expect(page.locator('[data-training]')).not.toHaveClass(/is-armed/);
  });
});

test.describe('Home without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('lists every checkpoint and every logo, with no dead button', async ({
    page,
  }) => {
    await page.goto('/');
    const section = page.locator('[data-training]');
    await expect(section.locator('.checkpoints > li:visible')).toHaveCount(
      await section.locator('.checkpoints > li').count(),
    );
    await expect(page.locator('main button:visible')).toHaveCount(0);
    await expect(
      page.locator('[data-partners] .group:not(.copy) img:visible'),
    ).toHaveCount(PARTNERS.length);
  });
});
