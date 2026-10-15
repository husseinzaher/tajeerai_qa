# QA agent contract

This is an independent Playwright repository for Tajeer AI; it does not own the application source. Respect the product's Arabic/English locales, tenant boundary, and distinct platform-admin and merchant sessions. Read README.md and manual/qa-checklist.md before extending coverage.

Do not claim a test passed unless it ran. Prefer reliable role/label/test-id locators and web-first assertions. Avoid hardcoded delays. Never read, write, print, commit, or upload live credentials / session storage. Never execute destructive, billing, message-sending or externally integrated flows against production. Use disposable seeded test data and isolated staging. Capture sanitized traces for reproducible failures. Keep CI read-only unless explicitly approved and supported by dedicated fixtures. Separate smoke, API, merchant and admin suites, with auth projects opt-in.
