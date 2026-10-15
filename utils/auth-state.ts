import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export type AuthRole = 'merchant' | 'admin';

export function authStatePath(role: AuthRole): string {
  return resolve(process.cwd(), '.auth', `${role}.json`);
}

export function hasAuthState(role: AuthRole): boolean {
  return existsSync(authStatePath(role));
}
