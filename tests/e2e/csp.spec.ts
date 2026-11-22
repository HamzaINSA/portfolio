import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/training',
  '/projects',
  '/projects/jai-pige',
  '/about',
  '/ask?q=When%20is%20he%20available%3F',
  '/legal',
  '/missing-page',
];

test.describe('Content Security Policy', () => {
  for (const path of PAGES) {
    test(`${path} runs without a CSP violation`, async ({ page }) => {
      await page.addInitScript(() => {
        (window as unknown as { cspViolations: string[] }).cspViolations = [];
        document.addEventListener('securitypolicyviolation', (e) => {
          (window as unknown as { cspViolations: string[] }).cspViolations.push(
            `${e.violatedDirective} ${e.blockedURI}`,
          );
        });
      });
      await page.goto(path);
      await expect(
        page.locator('meta[http-equiv="content-security-policy"]'),
      ).toHaveAttribute('content', /connect-src 'self'/);
      await page.mouse.wheel(0, 4000);
      await page.waitForLoadState('networkidle');
      const violations = await page.evaluate(
        () => (window as unknown as { cspViolations: string[] }).cspViolations,
      );
      expect(violations).toEqual([]);
    });
  }
});
