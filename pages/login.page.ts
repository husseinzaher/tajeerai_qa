import { expect, type Page } from '@playwright/test';

const signInButtonName = /sign in|تسجيل الدخول/i;

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(path: '/login' | '/admin/login'): Promise<void> {
    const response = await this.page.goto(path, { waitUntil: 'domcontentloaded' });

    if (!response) {
      throw new Error(`The browser received no response for ${path}.`);
    }

    expect(response.ok(), `${path} returned HTTP ${response.status()}`).toBeTruthy();
  }

  async expectFormVisible(): Promise<void> {
    await expect(this.page.getByRole('heading').first()).toBeVisible();
    await expect(this.page.getByRole('textbox').first()).toBeVisible();
    await expect(this.page.getByRole('button', { name: signInButtonName })).toBeVisible();
  }
}
