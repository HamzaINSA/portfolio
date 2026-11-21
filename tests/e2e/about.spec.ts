import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('About page', () => {
  test('has no accessibility violation', async ({ page }) => {
    await page.goto('/about');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('shows the terminal summary and the photo', async ({ page }) => {
    await page.goto('/about');
    await expect(
      page.getByRole('heading', { level: 1, name: 'About the model' }),
    ).toBeVisible();
    const term = page.getByRole('group', { name: 'Model summary' });
    await expect(term).toContainText('hamza 4.0');
    await expect(term).toContainText('4th year');
    await expect(term).toContainText('less energy and compute');
    const photo = page.getByRole('img', {
      name: 'Portrait of Hamza Bencheikh',
    });
    await expect(photo).toBeVisible();
    expect(
      await photo.evaluate((img: HTMLImageElement) => img.naturalWidth),
    ).toBeGreaterThan(0);
  });

  test('shows the release notes, newest first, with the current one marked', async ({
    page,
  }) => {
    await page.goto('/about');
    const notes = page.getByRole('region', { name: 'Release notes' });
    const versions = await notes.locator('.ver').allTextContents();
    expect(versions[0]).toBe('v6');
    expect(versions.at(-1)).toBe('v1–v2');
    const current = notes.locator('.rel--current');
    await expect(current).toHaveCount(1);
    await expect(current).toContainText('LATEST');
    await expect(current).toContainText('Sapporo');
    await expect(notes).toContainText('KTH');
    await expect(notes).toContainText('ETH Zurich and EPFL');
  });

  test('"show what I learned" opens with the keyboard', async ({ page }) => {
    await page.goto('/about');
    const summary = page.getByText('show what I learned');
    const learned = page.getByText('Delivering at the pace of sprints.');
    await expect(learned).toBeHidden();
    await summary.focus();
    await page.keyboard.press('Enter');
    await expect(learned).toBeVisible();
  });

  test('never shows a CV or a placeholder', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByText(/\bCV\b/)).toHaveCount(0);
    const text = await page.locator('main').innerText();
    for (const forbidden of ['[TO CONFIRM', '[SOURCE NEEDED']) {
      expect(text).not.toContain(forbidden);
    }
  });

  test('lists capabilities and the deploy strip leads to the contact block', async ({
    page,
  }) => {
    await page.goto('/about');
    const capabilities = page.getByRole('region', { name: 'Capabilities' });
    await expect(capabilities.getByText('Python')).toBeVisible();
    await expect(capabilities.getByText('French (Native)')).toBeVisible();
    const deploy = page.getByRole('region', { name: 'Deploy this model' });
    await expect(deploy).toContainText('--from 2027-05');
    await expect(deploy).toContainText('open to relocation');
    await deploy.getByRole('link', { name: 'CONTACT →' }).click();
    await expect(page).toHaveURL(/#contact$/);
  });

  test('contact block links to the email, LinkedIn and GitHub', async ({
    page,
  }) => {
    await page.goto('/about#contact');
    const contact = page.locator('#contact');
    await expect(
      contact.getByRole('link', { name: 'hamza.bencheikh@insa-lyon.fr' }),
    ).toHaveAttribute('href', 'mailto:hamza.bencheikh@insa-lyon.fr');
    await expect(
      contact.getByRole('link', { name: /LinkedIn/ }),
    ).toHaveAttribute('href', /linkedin\.com/);
    await expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
      'href',
      /github\.com/,
    );
  });

  // Never submit a valid form here: it would open the mail app of whoever runs the tests.
  // The mailto: link itself is covered by the unit tests (tests/unit/about.test.ts).
  test('the form has labelled fields', async ({ page }) => {
    await page.goto('/about');
    const form = page.getByRole('form', { name: 'Contact form' });
    for (const label of ['Name', 'Email', 'Message']) {
      await expect(form.getByLabel(label)).toBeVisible();
    }
  });

  test('the form requires its fields before opening the mail client', async ({
    page,
  }) => {
    await page.goto('/about');
    const form = page.getByRole('form', { name: 'Contact form' });
    const valid = await form.evaluate((f: HTMLFormElement) =>
      f.checkValidity(),
    );
    expect(valid).toBe(false);
  });

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/about');
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe('About page without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the form still targets the mail client', async ({ page }) => {
    await page.goto('/about');
    await expect(
      page.getByRole('form', { name: 'Contact form' }),
    ).toHaveAttribute('action', 'mailto:hamza.bencheikh@insa-lyon.fr');
  });
});
