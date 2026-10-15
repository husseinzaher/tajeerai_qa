import { expect, test } from '@playwright/test';

test('merchant can open their dashboard using a recorded session @authenticated', async ({ page }) => {
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/dashboard(?:[/?#]|$)/);
  await expect(page.locator('main')).toBeVisible();
});
