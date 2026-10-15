import { test, expect } from '../../fixtures/authenticated-test';
import { hasAuthState } from '../../utils/auth-state';

test.skip(!hasAuthState('admin'), 'Record an admin session with npm run auth:admin to enable this check.');

test('platform admin can open the back office with a recorded session @authenticated @admin', async ({ page }) => {
  await page.goto('/admin', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/admin(?:[/?#]|$)/);
  await expect(page.getByRole('main')).toBeVisible();
});
