import { test as base, type PlaywrightTestOptions } from '@playwright/test';
import { basename, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { authStatePath, type AuthRole } from '../utils/auth-state';

type AuthFixtures = {
  storageState: PlaywrightTestOptions['storageState'];
};

/** Loads an ignored, locally recorded session for the matching authenticated suite. */
export const test = base.extend<AuthFixtures>({
  storageState: async ({}, use, testInfo) => {
    const directory = basename(dirname(testInfo.file));
    const role: AuthRole | undefined = directory === 'admin'
      ? 'admin'
      : directory === 'dashboard'
        ? 'merchant'
        : undefined;
    const statePath = role ? authStatePath(role) : undefined;

    await use(statePath && existsSync(statePath) ? statePath : undefined);
  },
});

export { expect } from '@playwright/test';
