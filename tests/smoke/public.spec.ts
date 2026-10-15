import { test } from '@playwright/test';
import { expectHealthyHtml } from '../../src/support/navigation';

test.describe('Public pages @smoke', () => {
  test('marketing homepage responds with HTML', async ({ page }) => {
    await expectHealthyHtml(page, '/');
  });
  test('merchant login page responds with HTML', async ({ page }) => {
    await expectHealthyHtml(page, '/login');
  });
  test('platform admin login page responds with HTML', async ({ page }) => {
    await expectHealthyHtml(page, '/admin/login');
  });
});
