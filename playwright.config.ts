import { defineConfig, devices } from '@playwright/test';

// Local escape hatch: PW_CHANNEL=chrome uses an installed Google Chrome instead of the downloaded Chromium.
const channel = process.env['PW_CHANNEL'];
// Port of the preview server used by the tests; change it if 4321 is taken (for example by `npm run dev`).
const port = process.env['PW_PORT'] ?? '4321';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: `npm run build && npm run preview -- --port ${port} --ignore-lock`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], ...(channel ? { channel } : {}) },
    },
    {
      name: 'phone',
      use: { ...devices['Pixel 7'], ...(channel ? { channel } : {}) },
    },
  ],
});
