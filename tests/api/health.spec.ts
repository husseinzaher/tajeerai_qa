import { expect, test } from '@playwright/test';
import { backendURL } from '../../config/environment';

test('backend API health responds successfully @api', async ({ request }) => {
  const response = await request.get(new URL('/api/health', backendURL).toString());
  expect(response.ok(), `Backend health returned HTTP ${response.status()}`).toBeTruthy();
});
