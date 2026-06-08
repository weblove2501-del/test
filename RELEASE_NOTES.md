# Release Notes — Draft

Date: 2026-06-08

## Summary

- feat: Stabilize login flow
  - Added client-side validation, per-field errors, and loading state in `LoginForm`.
  - On successful login, form clears and a notification is shown.

- feat: Token lifecycle and session restoration
  - `AppContext` now saves user info to `localStorage`, restores session on mount, and integrates with token manager for automatic refresh and expiry handling.

- feat: Harden Task form
  - `TaskForm` refactored with `useReducer`, added stronger validation (title, assignee, due date), and prevents past due dates.

- accessibility: UI improvements
  - Added ARIA attributes, alert regions and dialog semantics to `LoginForm`, `TaskForm`, and global `Layout` live region for notifications.

- test: Test infra
  - Added `vitest` and a basic token manager test to validate token save/get/clear behavior.

## Notes

- This is a local draft. If you'd like, I can open a PR with these changes (requires GitHub token) or prepare a more formal changelog entry.
