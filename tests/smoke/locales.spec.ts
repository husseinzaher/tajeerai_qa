import { expect, test } from '@playwright/test';

test.describe('Arabic and English document direction @smoke', () => {
  test('Arabic pages declare RTL direction', async ({ page }) => {
    await page.goto('/ar', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });

  test('English pages declare LTR direction', async ({ page }) => {
    await page.goto('/en', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });
});
