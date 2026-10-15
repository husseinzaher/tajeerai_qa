import { randomUUID } from 'node:crypto';
import { test, expect } from '../../fixtures/authenticated-test';
import { hasAuthState } from '../../utils/auth-state';
import { openWorkspacePage } from '../../src/support/workspace-audit';

test.skip(Boolean(process.env.CI) || !hasAuthState('merchant') || process.env.QA_ALLOW_DRAFT_WRITES !== '1',
  'Opt-in only: requires a disposable workspace and QA_ALLOW_DRAFT_WRITES=1.');
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test('create, edit and reload an unpublished blog draft @authenticated @draft-write', async ({ page }) => {
  const slug = `qa-draft-${randomUUID()}`;
  const title = `QA ${slug}`;
  const edited = `${title} edited`;

  await openWorkspacePage(page, '/dashboard/blog');
  await page.getByRole('link', { name: /^(?:مقالة جديدة|New post)$/ }).click();
  await page.getByLabel(/^(?:عنوان الصفحة|Page title) \(EN\)$/).fill(title);
  await page.getByLabel(/^(?:عنوان الصفحة|Page title) \(AR\)$/).fill(title);
  await page.locator('#post-slug').fill(slug);
  await expect(page.locator('#post-status')).toContainText(/مسودة|Draft/);
  await page.getByRole('button', { name: /^(?:حفظ التغييرات|Save changes)$/ }).click();
  await expect(page).toHaveURL(/\/dashboard\/blog$/);
  const row = page.getByRole('row').filter({ hasText: title });
  await expect(row).toContainText(/مسودة|Draft/);
  await row.getByRole('link', { name: /^(?:تعديل|Edit)$/ }).click();
  await page.getByLabel(/^(?:عنوان الصفحة|Page title) \(AR\)$/).fill(edited);
  await page.getByRole('button', { name: /^(?:حفظ التغييرات|Save changes)$/ }).click();
  await expect(page).toHaveURL(/\/dashboard\/blog$/);
  const updated = page.getByRole('row').filter({ hasText: edited });
  await expect(updated).toBeVisible();
  await updated.getByRole('link', { name: /^(?:تعديل|Edit)$/ }).click();
  await expect(page.getByLabel(/^(?:عنوان الصفحة|Page title) \(AR\)$/)).toHaveValue(edited);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByLabel(/^(?:عنوان الصفحة|Page title) \(AR\)$/)).toHaveValue(edited);
  await expect(page.locator('#post-status')).toContainText(/مسودة|Draft/);
  // Keep the explicitly named draft for review; this test never publishes or permanently deletes it.
});
