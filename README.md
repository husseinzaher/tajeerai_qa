# Tajeer AI QA · Playwright

An independent Playwright Test repository for Tajeer AI. It stays separate from the frontend and backend packages and is included in the main workspace at `qa/` as a Git submodule.

## Get started

From a fresh main-workspace checkout:

```bash
git submodule update --init --recursive
npm --prefix qa ci
npx --prefix qa playwright install chromium
```

Native development services use these defaults:

- Frontend: `http://localhost:3011`
- Backend: `http://localhost:4040`

Set `FRONTEND_URL` or `BACKEND_URL` to test another development or isolated staging environment. The values in `.env` override the defaults. `QA_BASE_URL` and `QA_API_URL` remain accepted as legacy aliases. Copy `.env.example` to `.env` to set local targets; do not commit `.env`.

## Automated tests

```bash
npm --prefix qa test                 # all browser projects and test suites
npm --prefix qa run test:smoke       # public pages, login pages, access gates, navigation, locales
npm --prefix qa run test:auth        # authentication entry pages and optional session checks
npm --prefix qa run test:admin       # platform-admin session check
npm --prefix qa run test:dashboard   # merchant dashboard session check
npm --prefix qa run test:api         # backend /api/health check
npm --prefix qa run test:cross-browser
npm --prefix qa run typecheck
npm --prefix qa run report
```

The Playwright projects cover desktop Chromium, Firefox and WebKit, plus a mobile Chromium viewport. Install all browser engines before running the full suite:

```bash
npm --prefix qa run browsers:install
```

Smoke checks use the real frontend routes `/`, `/login`, `/admin/login`, `/dashboard`, `/admin`, `/ar` and `/en`. They do not submit login forms or change application data. The API check only reads `/api/health`.

Authenticated tests use ignored local session files in `.auth/`. They are skipped when the matching session is missing:

```bash
npm --prefix qa run auth:merchant
npm --prefix qa run auth:admin
```

These commands open a browser so you can sign in manually; the session files contain cookies and must never be committed or uploaded.

## Manual exploratory testing

Playwright UI Mode lets you select tests, inspect locators, replay steps, and review traces:

```bash
npm --prefix qa run test:ui
```

For a visible browser or step-by-step Inspector session:

```bash
npm --prefix qa run test:headed
npm --prefix qa run test:debug
```

The manual checklist and per-run template are in [`manual/`](manual/).

## Codegen and reports

Record interactions against the configured frontend, or pass a URL explicitly:

```bash
npm --prefix qa run codegen
npm --prefix qa run codegen -- http://localhost:3011/login
```

Failed tests retain browser traces, screenshots and videos under `test-results/`. HTML and JUnit reports are written to `playwright-report/` and `test-results/junit.xml`:

```bash
npm --prefix qa run report
npx --prefix qa playwright show-trace test-results/artifacts/<test>/trace.zip
```

## GitHub Actions

GitHub Actions always installs the runner and browsers. When no test target is configured it runs a browser-runner check that needs no application services. To run application smoke checks, set the repository Actions variable `FRONTEND_URL`, or provide `frontend_url` when manually dispatching the workflow. The API check runs only when `BACKEND_URL` or the legacy `QA_API_URL` variable is set. Reports and failure evidence are uploaded as workflow artifacts.

Use an isolated development or staging environment for configured checks. Current automated tests are read-only and do not perform production writes.

## Test design

- Prefer `getByRole`, `getByLabel` and `getByTestId`, with web-first assertions.
- Test Arabic and English document direction as well as route behavior.
- Keep merchant and platform-admin sessions separate.
- Keep credentials and browser storage out of Git and CI artifacts.
- Do not add destructive, payment, messaging or third-party integration flows to the smoke suite.
