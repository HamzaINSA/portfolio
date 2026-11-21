import { test } from '@playwright/test';

// TEMPORARY diagnostic for the Firefox crash on /about. Removed before merge.
test('diag: about page in firefox', async ({ page, browserName }) => {
  test.skip(browserName !== 'firefox');
  page.on('crash', () => console.log('DIAG crash event'));
  page.on('console', (m) => console.log('DIAG console', m.type(), m.text()));
  await page.goto('/about');
  console.log('DIAG loaded');
  for (const ms of [500, 1000, 2000, 3000]) {
    await page.waitForTimeout(ms);
    console.log('DIAG alive after', ms, await page.title());
  }
  const notes = page.getByRole('region', { name: 'Release notes' });
  console.log('DIAG ver', await notes.locator('.ver').allTextContents());
  console.log('DIAG plain count', await page.locator('.rel--current').count());
  console.log('DIAG scoped count', await notes.locator('.rel--current').count());
  console.log('DIAG text', (await notes.locator('.rel--current').innerText()).slice(0, 60));
});
