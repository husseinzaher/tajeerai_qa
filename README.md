# Tajeer AI QA · Playwright

Standalone, private QA repository for [Tajeer AI](https://tajeerai.com). Connect as the `qa/` Git submodule inside `husseinzaher/tajeerai_workspace`. **Do not put E2E dependencies in the frontend or backend repositories.**

## Scope

- Automated browser smoke checks for public pages and anonymous authorization gates.
- Optional API health, authenticated merchant, and platform-admin checks.
- Manual exploratory sessions using Playwright UI Mode, Codegen and Inspector.
- Chromium by default; Firefox, WebKit and mobile Chromium via the cross-browser command.
- Screenshots, video and traces on failures, with HTML / JUnit reports.
- GitHub Actions: pushes, pull requests, daily schedule and manual dispatch against a **configured QA target**. No automatic messages, payments or writes.

The initial tests are a **starter suite, not full feature coverage**. Extend it with seeded test accounts and read-only workflows first, then isolated, idempotent sandbox mutations. The target needs a running frontend and backend; the test repository never starts Docker or the native stack implicitly.

## Prerequisites

Node.js 22+, npm, and a running Tajeer AI environment. For native development in the parent workspace run `make run-native` (frontend :3011, backend :4040). On Ubuntu, run:

```bash
cp .env.example .env
npm install
npx playwright install --with-deps chromium
npm run test:smoke
npm run report
```

This starter distribution has no `package-lock.json` because dependencies could not be downloaded in its build environment. **Commit the generated `package-lock.json` after the first `npm install`; then switch CI to `npm ci` for reproducibility.**

### Commands

```bash
npm run test:smoke                 # 5 anonymous UI tests (no logins)
npm run test:api                   # backend health (requires QA_API_URL)
npm run test:ui                    # interactive browser inspection / replay
npm run test:headed                # visible Chromium browser
npm run test:debug                 # Playwright inspector
npm run test:cross-browser         # Chromium + Firefox + WebKit + mobile; install all browsers first
npm run codegen -- http://localhost:3011/login
npm run auth:merchant              # interactive login → .auth/merchant.json
npm run auth:admin                 # interactive login → .auth/admin.json
npm run test:merchant              # opt-in recorded merchant session
npm run test:admin                 # opt-in recorded platform-admin session
npm run report                     # HTML test report
npx playwright show-trace test-results/.../trace.zip
npm run typecheck
```

For cross-browser testing, run `npm run browsers:install` first. Run Codegen and auth recorder in a desktop session with a display. UI Mode is interactive (not a separate hosted application).

Never put credentials into test files, commit `.auth/` or `.env`, or send session artifacts outside the trusted QA team. GitHub Actions runs **anonymous smoke tests only**; authenticated sessions remain local until a secure test-identity strategy is implemented.

## CI target

In the new GitHub QA repository, set **Settings → Secrets and variables → Actions → Variables**:

- `QA_BASE_URL`: accessible staging frontend, such as `https://staging.example.com` (required to enable CI job).
- `QA_API_URL`: accessible staging backend origin (optional; only for API checks).

If `QA_BASE_URL` is unset, CI's smoke job intentionally skips. For useful scheduled checks use a stable isolated staging environment; do not target production with mutating tests. Scheduled workflow triggers depend on GitHub Actions availability and repository settings.

## Publishing the submodule

The GitHub connector used to prepare this scaffold can modify existing repositories but cannot create a new repository. This distribution ships a script to create a private GitHub QA repo and stage the parent submodule on your own machine, after you have installed and authenticated the [GitHub CLI](https://cli.github.com/).

**Extract this ZIP outside the parent repo** (e.g. `~/Projects/tajeerai-qa`), then:

```bash
cd ~/Projects/tajeerai-qa
./scripts/publish-and-link.sh ~/Projects/tajeerai/node husseinzaher/tajeerai_qa qa
# Review the .gitmodules and QA gitlink staged in the parent before committing.
cd ~/Projects/tajeerai/node
git diff --cached -- .gitmodules qa
git commit -m 'test: add Playwright QA submodule'
git push
```

`node` above is the workspace root that contains `backend/`, `frontend/` and `.gitmodules`; adjust it to your checkout. You need SSH access to the private QA repo for `git submodule add`. Later checkouts run `git submodule update --init --recursive`. This script will **refuse** to repurpose an existing remote repository or an existing `qa/` directory.

To run QA from the parent root after linking: `npm --prefix qa install && npm --prefix qa run test:ui` (or `cd qa && npm run test:ui`).

## Test design rules

- Prefer Playwright `getByRole`, `getByLabel` and stable `data-testid` selectors for feature tests. Never use brittle CSS classes or sleep-based timing.
- Web-first assertions (`expect(...).toBeVisible`, `toHaveURL`, etc.); do not depend on fixed English content because Tajeer AI is Arabic-first/RTL.
- Isolate fixtures by workspace; no cross-tenant access. Treat tests modifying remote services (WhatsApp, Salla, Zid, Paddle) as sandbox-only.
- Report failures with trace and reproduction steps; sanitize recordings before sharing them.
- Manual inventory lives in `manual/qa-checklist.md`; each release uses `manual/test-run-template.md`.
