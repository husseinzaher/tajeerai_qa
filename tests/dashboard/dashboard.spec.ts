import { test, expect } from '../../fixtures/authenticated-test';
import { hasAuthState } from '../../utils/auth-state';

test.skip(!hasAuthState('merchant'), 'Record a merchant session with npm run auth:merchant to enable this check.');

test('merchant can open the dashboard with a recorded session @authenticated @dashboard', async ({ page }) => {
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/dashboard(?:[/?#]|$)/);
  await expect(page.getByRole('main')).toBeVisible();
});
