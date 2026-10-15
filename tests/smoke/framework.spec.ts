import { expect, test } from '@playwright/test';

test('browser runner launches without application services @framework', async ({ page }) => {
  await page.setContent('<main><h1>Playwright is ready</h1></main>');

  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Playwright is ready' })).toBeVisible();
});
