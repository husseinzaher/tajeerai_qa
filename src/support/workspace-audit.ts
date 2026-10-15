import { expect, type Page, type Request } from '@playwright/test';

/** Only route/status/code are retained: response payloads and URL queries may contain private data. */
export interface ApiFailure {
  path: string;
  status: number;
  code: string | null;
}

export function observeApiFailures(page: Page): { failures: ApiFailure[]; settle: () => Promise<void> } {
  const failures: ApiFailure[] = [];
  const pending = new Set<Promise<void>>();
  const inFlight = new Set<Request>();
  let started = false;

  page.on('request', (request) => {
    if (new URL(request.url()).pathname.startsWith('/api/v1/')) {
      started = true;
      inFlight.add(request);
    }
  });
  page.on('requestfinished', (request) => inFlight.delete(request));
  page.on('requestfailed', (request) => inFlight.delete(request));

  page.on('response', (response) => {
    const path = new URL(response.url()).pathname;
    if (!path.startsWith('/api/v1/') || response.status() < 400) return;

    const read = async (): Promise<void> => {
      let code: string | null = null;
      try {
        const body: unknown = await response.json();
        if (typeof body === 'object' && body !== null) {
          if ('code' in body && typeof body.code === 'string') code = body.code;
          else if ('error' in body && typeof body.error === 'string') code = body.error;
        }
      } catch {
        // Non-JSON failures are still reported by status and path.
      }
      failures.push({ path, status: response.status(), code });
    };

    const task = read();
    pending.add(task);
    void task.finally(() => pending.delete(task));
  });

  return {
    failures,
    settle: async () => {
      // JSON API requests settle; long-lived realtime connections are deliberately excluded.
      await expect.poll(() => started && inFlight.size === 0, { timeout: 30_000 }).toBe(true);
      await Promise.all([...pending]);
    },
  };
}

export async function openWorkspacePage(page: Page, path: string): Promise<void> {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  expect(response?.ok(), `Navigation failed: ${path}`).toBeTruthy();
  await expect(page).toHaveURL(new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[?#]|$)`));
  const main = page.getByRole('main');
  await expect(main).toBeVisible();
  await expect(main).not.toBeEmpty();
  await expect(main.locator('[aria-busy="true"]')).toHaveCount(0, { timeout: 30_000 });
  await expect(main.getByText(/^(?:جارٍ التحميل…|Loading…)$/)).toHaveCount(0, { timeout: 30_000 });
}
