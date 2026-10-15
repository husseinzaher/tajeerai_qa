import { expect, test } from '@playwright/test';

test.describe('Anonymous access gates @smoke @security', () => {
  test('merchant dashboard redirects an anonymous visitor to login', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
  });

  test('platform back office redirects an anonymous visitor to login', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/admin\/login(?:[/?#]|$)/);
  });
});
