import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('Authentication entry pages @auth', () => {
  test('merchant login renders a usable form @smoke', async ({ page }) => {
    const login = new LoginPage(page);

    await login.open('/login');
    await login.expectFormVisible();
  });

  test('platform admin login renders a usable form @smoke', async ({ page }) => {
    const login = new LoginPage(page);

    await login.open('/admin/login');
    await login.expectFormVisible();
  });

  test('admin login links back to workspace sign-in @smoke', async ({ page }) => {
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });

    const workspaceSignIn = page.getByRole('link', { name: /workspace sign in|دخول مساحة العمل/i });
    await expect(workspaceSignIn).toHaveAttribute('href', '/login');
    await workspaceSignIn.click();
    await expect(page).toHaveURL(/\/login(?:[/?#]|$)/);
  });
});
