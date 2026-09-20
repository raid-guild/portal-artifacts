import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/usr/bin/google-chrome') ? '/usr/bin/google-chrome' : undefined);
export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, launchOptions: { executablePath }, screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
