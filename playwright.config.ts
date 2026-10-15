import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { frontendURL } from './config/environment';

const isCI = process.env.CI === 'true';
const workers = Number(process.env.QA_WORKERS ?? '2');

if (!Number.isInteger(workers) || workers < 1) {
  throw new Error('QA_WORKERS must be a positive integer.');
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: isCI ? 1 : 0,
  workers,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: frontendURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  outputDir: './test-results/artifacts',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
