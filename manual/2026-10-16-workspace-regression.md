# Workspace regression — 2026-10-16

Target: https://tajeerai.com. The owner identified the current workspace as disposable test space and authorized editing it. Browser exploration used the existing authenticated session; no credentials or session storage were exported.

## Findings and changes

- **System-wide Salla gate:** an unconnected Salla status returned HTTP 200, while the integrations catalog and operational/report APIs returned HTTP 403 with `SALLA_INITIAL_SYNC_REQUIRED`. Removed the global API guard and MCP restriction locally. Required synchronization remains part of the setup wizard only. These changes are not deployed by this audit.
- **Workspace switch:** integration catalog now remounts when the tenant changes; a regression test verifies that the previous workspace's catalog is replaced. The observed Salla blocker does not establish cross-tenant database disclosure. Live cross-tenant isolation still needs two authorized test workspaces.
- **Settings navigation:** channel links now lead to `/dashboard/channels`; the action says “Add a channel” in both locales.
- **Form navigation:** creating a marketing plan now retains its list beside the form for direct links, reloads and intercepted navigation.
- **Error handling/accessibility:** resource tables localize API errors; the inbox composer has a stable accessible name.

## Execution evidence

- Live browser: 59 dashboard routes inspected, plus the new marketing-plan form. Navigation coverage is not CRUD coverage. The authenticated regression spec lists the routes explicitly.
- Live interaction: channel filters, product tabs, settings links and 390px layout checks on channels/settings/marketing plans.
- Live write: created an unpublished article named “مسودة اختبار 2026-10-16”, edited it to “مسودة اختبار معدلة 2026-10-16”, reopened the edit URL and verified the new title persisted after reload. Left this single draft for review. This workflow passed in the live browser; its standalone Playwright counterpart is authored, not yet executed.
- Anonymous Playwright smoke/framework run against the target: **11 passed**.
- Targeted frontend tests: **60 passed** (resource table/setup wizard), **80 passed** (composer/channel settings/marketing-plan routes). Integration catalog tests: **21 passed**.
- Targeted backend tests: **22 passed** (initial-sync state, MCP authorization/availability and transport).
- QA TypeScript check passed. Authenticated Playwright scenarios were authored but were not executed by the standalone runner: it requires its own locally recorded test session. Live browser checks above were performed separately.
- Frontend typecheck, lint, dependency architecture check and production build passed. Backend typecheck, lint and dependency architecture check passed.
- Full frontend/backend suites were attempted, produced failures, then were interrupted after no further useful progress. Frontend failures include AI/support/shell/generated-token suites outside this change. Backend execution also lacks required test database/runtime configuration. Do not interpret targeted passes as a green full suite or CI.

## Remaining execution limits

The remote site still runs the old Salla gate, so save/edit workflows depending on those APIs cannot validate the local fix until it is released. Development projects are inaccessible to the current account's role. No messages, payments, external integrations, permission changes or irreversible deletions were executed. Full end-to-end tenant isolation and writes beyond the blog draft remain unverified.

## Reproduce after releasing the fix

```bash
cd qa
npm run auth:merchant
QA_BASE_URL=https://tajeerai.com QA_RUN_MERCHANT=1 npm test -- --project=merchant-chromium --grep @regression
```

Log in interactively to the disposable workspace. Keep `.auth/` private. The new regression suite is read-only and disables screenshots, videos and traces to avoid recording workspace content; failed API evidence contains only route, status and error code.
