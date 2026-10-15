import 'dotenv/config';
import { existsSync } from 'node:fs';
import { defineConfig, devices, type Project } from '@playwright/test';

const baseURL = process.env.QA_BASE_URL ?? 'http://localhost:3011';
const isCI = Boolean(process.env.CI);

// Do not load saved browser sessions in CI. An authenticated suite is opt-in.
const merchantState = '.auth/merchant.json';
const adminState = '.auth/admin.json';
const projects: Project[] = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    testIgnore: ['**/merchant/**', '**/dashboard/**', '**/admin/**'],
  },
];

if (process.env.QA_ALL_BROWSERS === '1') {
  projects.push(
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, testIgnore: ['**/merchant/**', '**/dashboard/**', '**/admin/**'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: ['**/merchant/**', '**/dashboard/**', '**/admin/**'] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, testIgnore: ['**/merchant/**', '**/dashboard/**', '**/admin/**'] },
  );
}

if (!isCI && process.env.QA_RUN_MERCHANT === '1') {
  if (!existsSync(merchantState)) throw new Error(`Missing ${merchantState}. Run npm run auth:merchant first.`);
  projects.push({ name: 'merchant-chromium', testMatch: ['**/merchant/**/*.spec.ts', '**/dashboard/**/*.spec.ts'], use: { ...devices['Desktop Chrome'], storageState: merchantState } });
}
if (!isCI && process.env.QA_RUN_ADMIN === '1') {
  if (!existsSync(adminState)) throw new Error(`Missing ${adminState}. Run npm run auth:admin first.`);
  projects.push({ name: 'admin-chromium', testMatch: '**/admin/**/*.spec.ts', use: { ...devices['Desktop Chrome'], storageState: adminState } });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : 2,
  reporter: isCI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  outputDir: './test-results/artifacts',
  projects,
});
