import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const url = process.argv[2] ?? process.env.FRONTEND_URL ?? process.env.QA_BASE_URL ?? 'http://localhost:3011';
const runner = resolve('node_modules/.bin/playwright');
const result = spawnSync(runner, ['codegen', url], { stdio: 'inherit' });
process.exit(result.status ?? 1);
