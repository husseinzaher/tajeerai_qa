import { expect, type Page } from '@playwright/test';

/** A smoke test should detect a broken page without assuming marketing copy. */
export async function expectHealthyHtml(page: Page, path: string): Promise<void> {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  expect(response, `No navigation response for ${path}`).not.toBeNull();
  expect(response!.ok(), `${path} returned HTTP ${response!.status()}`).toBeTruthy();
  await expect(page.locator('html')).toBeVisible();
  await expect(page.locator('body')).not.toBeEmpty();
}
