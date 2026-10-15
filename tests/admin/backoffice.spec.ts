import { expect, test } from '@playwright/test';

test('platform admin can open the back office using a recorded session @authenticated', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin(?:[/?#]|$)/);
  await expect(page.locator('main')).toBeVisible();
});
