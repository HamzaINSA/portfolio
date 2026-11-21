import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('About page', () => {
  test('has no accessibility violation', async ({ page }) => {
    await page.goto('/about');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('shows the bio, the photo and the intended use', async ({ page }) => {
    await page.goto('/about');
    await expect(
      page.getByRole('heading', { level: 1, name: 'About the model' }),
    ).toBeVisible();
    await expect(page.locator('.bio')).toHaveCount(4);
    await expect(page.getByText(/I plan to join KTH/)).toBeVisible();
    const photo = page.getByRole('img', {
      name: 'Portrait of Hamza Bencheikh',
    });
    await expect(photo).toBeVisible();
    expect(
      await photo.evaluate((img: HTMLImageElement) => img.naturalWidth),
    ).toBeGreaterThan(0);
    await expect(
      page.getByRole('heading', { name: 'intended use' }),
    ).toBeVisible();
  });

  test('omits model card cells without content and never shows a CV', async ({
    page,
  }) => {
    await page.goto('/about');
    for (const name of ['strengths', 'known limitations', 'out of scope']) {
      await expect(
        page.getByRole('heading', { name, exact: true }),
      ).toHaveCount(0);
    }
    await expect(page.getByText(/CV/)).toHaveCount(0);
    const text = await page.locator('main').innerText();
    for (const forbidden of ['[TO CONFIRM', '[SOURCE NEEDED']) {
      expect(text).not.toContain(forbidden);
    }
  });

  test('lists capabilities and the next training run', async ({ page }) => {
    await page.goto('/about');
    const capabilities = page.getByRole('region', { name: 'Capabilities' });
    await expect(capabilities.getByText('Python')).toBeVisible();
    await expect(capabilities.getByText('French (Native)')).toBeVisible();
    const next = page.getByRole('region', { name: "Where I'm heading" });
    await expect(next).toContainText('Planned double degree at KTH');
    await expect(next).toContainText('ETH Zurich and EPFL');
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

  test('the form has labelled fields and sends nothing over the network', async ({
    page,
    baseURL,
  }) => {
    await page.goto('/about');
    const form = page.getByRole('form', { name: 'Contact form' });
    await form.getByLabel('Name').fill('Ada');
    await form.getByLabel('Email').fill('ada@example.org');
    await form.getByLabel('Message').fill('Hello');
    const requests: string[] = [];
    page.on('request', (request) => requests.push(request.url()));
    await form.getByRole('button', { name: 'SEND' }).click();
    await page.waitForTimeout(300);
    expect(requests.filter((url) => url.startsWith('http'))).toEqual([]);
    expect(page.url().startsWith(baseURL ?? '')).toBe(true);
  });

  test('the form requires its fields before opening the mail client', async ({
    page,
  }) => {
    await page.goto('/about');
    const form = page.getByRole('form', { name: 'Contact form' });
    await form.getByRole('button', { name: 'SEND' }).click();
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
