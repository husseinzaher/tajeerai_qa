import { test, expect } from '../../fixtures/authenticated-test';
import { hasAuthState } from '../../utils/auth-state';
import { observeApiFailures, openWorkspacePage } from '../../src/support/workspace-audit';

test.skip(!hasAuthState('merchant'), 'Requires an isolated QA merchant session recorded with npm run auth:merchant.');
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

/** Routes observed in the merchant navigation; these tests never submit a form or send a message. */
const routes = [
  '/dashboard', '/dashboard/inbox', '/dashboard/channels',
  '/dashboard/outbound-messages', '/dashboard/templates', '/dashboard/auto-replies',
  '/dashboard/customers', '/dashboard/customers/stages', '/dashboard/customers/tags',
  '/dashboard/customers/fields', '/dashboard/customers/segments',
  '/dashboard/products', '/dashboard/pricing', '/dashboard/product-requests',
  '/dashboard/orders', '/dashboard/invoices', '/dashboard/seo', '/dashboard/shop',
  '/dashboard/landing', '/dashboard/landing/leads', '/dashboard/blog',
  '/dashboard/marketing', '/dashboard/marketing/plans', '/dashboard/campaigns',
  '/dashboard/marketing/calendar', '/dashboard/marketing/copilot', '/dashboard/message-templates',
  '/dashboard/marketing/channels', '/dashboard/automation',
  '/dashboard/dev/projects', '/dashboard/dev/integrations',
  '/dashboard/merchant-copilot', '/dashboard/chatbots', '/dashboard/ai', '/dashboard/mcp',
  '/dashboard/support', '/dashboard/help', '/dashboard/team', '/dashboard/settings',
  '/dashboard/integrations', '/dashboard/integrations/salla', '/dashboard/integrations/zid',
  '/dashboard/activity', '/dashboard/notifications',
  '/dashboard/reports', '/dashboard/reports/communication', '/dashboard/reports/revenue',
  '/dashboard/reports/inventory', '/dashboard/reports/team', '/dashboard/reports/assistant',
  '/dashboard/profile', '/dashboard/settings/workspace', '/dashboard/settings/business-profile',
  '/dashboard/subscription', '/dashboard/wallet', '/dashboard/settings/notifications',
  '/dashboard/settings/domains', '/dashboard/settings/watermark', '/dashboard/settings/api-keys',
] as const;

test.describe('Workspace navigation @authenticated @regression', () => {
  for (const route of routes) {
    test(`${route} settles without globally requiring Salla synchronization`, async ({ page }, testInfo) => {
      test.setTimeout(60_000);
      const api = observeApiFailures(page);
      await openWorkspacePage(page, route);
      await api.settle();

      await expect(page.getByRole('main')).not.toContainText(/Complete (?:the initial|the required) Salla/);
      await expect(page.getByRole('main').getByRole('alert').filter({ hasText: /تعذّر|تعذر|حدث خطأ|Failed to load|Something went wrong/i })).toHaveCount(0);
      expect(api.failures.filter((failure) => /salla_initial_sync_required/i.test(failure.code ?? ''))).toEqual([]);
      expect(api.failures.filter((failure) => failure.status >= 500)).toEqual([]);
      await testInfo.attach('api-failures', { body: JSON.stringify(api.failures, null, 2), contentType: 'application/json' });
    });
  }
});

test.describe('Read-only interactions @authenticated @regression', () => {
  test('a new marketing plan retains its list on direct arrival and reload', async ({ page }) => {
    await openWorkspacePage(page, '/dashboard/marketing/plans/new');
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await expect(page.getByRole('heading', { name: /^(?:خطط التسويق|Marketing plans)$/ })).toBeVisible();
      await expect(page.getByRole('heading', { name: /^(?:إنشاء خطة تسويقية|Create a marketing plan)$/ })).toBeVisible();
      if (attempt === 0) await page.reload({ waitUntil: 'domcontentloaded' });
    }
  });
  test('settings sends channel management to the channels screen', async ({ page }) => {
    await openWorkspacePage(page, '/dashboard/settings');
    await expect(page.getByRole('link', { name: /^(?:إضافة قناة|Add a channel)$/ })).toHaveAttribute('href', '/dashboard/channels');
  });
  test('channel filters change selection without leaving the screen', async ({ page }) => {
    await openWorkspacePage(page, '/dashboard/channels');
    const email = page.getByRole('tab', { name: /^(?:البريد الإلكتروني|Email)$/ });
    await email.click();
    await expect(email).toHaveAttribute('aria-selected', 'true');
    const all = page.getByRole('tab', { name: /^(?:الكل|All)$/ });
    await all.click();
    await expect(all).toHaveAttribute('aria-selected', 'true');
  });

  test('product categories and brands remain reachable', async ({ page }) => {
    await openWorkspacePage(page, '/dashboard/products');
    for (const name of [/^(?:التصنيفات|Categories)$/, /^(?:الماركات|Brands)$/, /^(?:المنتجات|Products)$/]) {
      const tab = page.getByRole('tab', { name });
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
    }
  });

  for (const route of ['/dashboard/channels', '/dashboard/settings', '/dashboard/marketing/plans']) {
    test(`${route} fits a 390px screen`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await openWorkspacePage(page, route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    });
  }
});
