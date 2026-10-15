# Tajeer AI — manual regression checklist

Record Pass / Fail / Blocked / Not Tested, the environment, evidence link and bug id per case. Use test data only, and never send real messages, alter subscriptions, or change production payments during QA.

| Case | Surface | Steps | Expected |
|---|---|---|---|
| AUTH-01 | Merchant | Open /login; submit invalid credentials | Safe error; no login, no session leak |
| AUTH-02 | Merchant | Log in to a dedicated QA workspace; refresh /dashboard | Session persists and workspace shell loads |
| AUTH-03 | Merchant | Log out; navigate back to /dashboard | Protected content remains inaccessible |
| AUTH-04 | Platform | Log in as platform support; open admin | Only authorized read actions available |
| AUTH-05 | Platform | Support tries a super-admin-only mutation in test environment | Request rejected, not merely hidden in UI |
| TEN-01 | Tenancy | Use workspace A; attempt a direct workspace B URL in staging | No customer/order/message from B is disclosed |
| TEN-02 | Tenancy | Switch between two QA workspaces with different data | Lists and API results are correctly scoped |
| INB-01 | Inbox | Open an existing seeded conversation; inspect sender, timestamp, state | Correct messages, no duplicate, readable RTL |
| INB-02 | Inbox | Assign a seeded conversation to QA teammate; refresh | Assignee and activity history persist |
| INB-03 | Inbox | Filter by unread/channel/assignee, then clear filters | Accurate results and reset |
| CHN-01 | Integrations | Open Salla and Zid connection settings using sandbox links | Correct provider configuration and no credential leakage |
| AI-01 | AI | Open routing groups and inspect models, tasks, status | Catalog renders; only allowed controls enabled |
| BILL-01 | Billing | Inspect wallet/plan history with seeded values | Totals, currency and permission boundaries agree |
| AUTO-01 | Automation | Create a non-sending workflow on a QA workspace; run it | Valid transition, status and audit log |
| RTL-01 | Accessibility | Switch Arabic ↔ English on login/dashboard | Layout direction, labels and keyboard navigation correct |
| UX-01 | Responsive | At 390px and desktop widths navigate primary screens | No clipped primary actions or sideways overflow |
| ERR-01 | Error handling | Temporarily stop QA backend; open dashboard | Friendly retry screen, not silent logout/data deletion |

## Manual execution protocol
1. Start native stack with `make run-native`, or use QA staging. Verify its identity before any action.
2. Run `npm run test:ui` for interactive exploration and time-travel debugging.
3. Run `npm run codegen -- http://localhost:3011/dashboard` to record a reproducible browser scenario; replace generated selectors with role/label/test id selectors.
4. For each failed case: save a sanitized screenshot/trace, console/network symptom, reproduction steps, expected vs actual and severity.
5. Add a Playwright regression spec when a bug is fixed. Do not add brittle timeouts or test against production data.
