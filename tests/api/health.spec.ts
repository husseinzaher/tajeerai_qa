import { expect, test } from '@playwright/test';

test('backend API health responds successfully @api', async ({ request }) => {
  const apiBase = process.env.QA_API_URL;
  test.skip(!apiBase, 'Set QA_API_URL to the backend origin to enable the API check.');
  const response = await request.get(new URL('/api/health', apiBase!).toString());
  expect(response.ok(), `Backend health returned HTTP ${response.status()}`).toBeTruthy();
});
