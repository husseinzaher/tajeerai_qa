import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const kind = process.argv[2];
if (!['merchant', 'admin'].includes(kind)) {
  console.error('Usage: node scripts/record-auth.mjs merchant|admin');
  process.exit(2);
}
mkdirSync('.auth', { recursive: true, mode: 0o700 });
const stateFile = resolve(`.auth/${kind}.json`);
const baseUrl = process.env.FRONTEND_URL ?? process.env.QA_BASE_URL ?? 'http://localhost:3011';
const startPath = kind === 'admin' ? '/admin/login' : '/login';
const url = new URL(startPath, baseUrl).toString();
console.log(`Log in manually in the opened browser, then close the codegen window to save state at ${stateFile}.`);
console.log('Never commit .auth files. They contain sensitive session cookies.');
const runner = resolve('node_modules/.bin/playwright');
const result = spawnSync(runner, ['codegen', `--save-storage=${stateFile}`, url], { stdio: 'inherit' });
process.exit(result.status ?? 1);
