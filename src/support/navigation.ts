import { expect, type Page } from '@playwright/test';

/** A smoke test should detect a broken page without assuming marketing copy. */
export async function expectHealthyHtml(page: Page, path: string): Promise<void> {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });

  if (!response) {
    throw new Error(`The browser received no response for ${path}.`);
  }

  expect(response.ok(), `${path} returned HTTP ${response.status()}`).toBeTruthy();
  await expect(page.locator('html')).toBeVisible();
  await expect(page.locator('body')).not.toBeEmpty();
}
