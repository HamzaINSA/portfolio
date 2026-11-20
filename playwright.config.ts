import { defineConfig, devices } from '@playwright/test';

// Local escape hatch: PW_CHANNEL=chrome uses an installed Google Chrome instead of the downloaded Chromium.
const channel = process.env['PW_CHANNEL'];

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321 --ignore-lock',
    url: 'http://localhost:4321',
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
