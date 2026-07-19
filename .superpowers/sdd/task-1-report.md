# Task 1 Report: Add session expiry and two-tier storage to auth.js

## What I implemented
- Replaced `utils/auth.js` with two-tier auth storage support.
- Added `AUTH_KEYS` and `SESSION_DURATION_MS` set to 15 minutes.
- Added internal helpers: `_storage`, `_write`, `_read`, `_remove`, `_clearAll`, and `_clearBoth`.
- Added `_findValidSession()` with sessionStorage priority over localStorage and expiry-aware cleanup.
- Updated `initSession()` to restore valid sessions and sync `window.api` / `window.state`.
- Updated `login(email, password, remember = false)` to store auth data in sessionStorage by default or localStorage when remember is true, including expiry timestamp.
- Updated `getUser()` and `isLoggedIn()` to depend on `_findValidSession()`.
- Updated `logout()` to clear both localStorage and sessionStorage and reset app state before redirecting to login.
- Kept `normalizeUser(user)` behavior consistent with the original implementation.

## Files changed
- `C:\Users\DELL\Downloads\neoviet360 (2) - Copy\neoviet360\utils\auth.js`
- `C:\Users\DELL\Downloads\neoviet360 (2) - Copy\neoviet360\.superpowers\sdd\task-1-report.md`

## Self-review findings
- Confirmed the requested helper methods are present.
- Confirmed `_findValidSession()` returns `{ token, user, storage }` or `null` and prioritizes sessionStorage.
- Confirmed expired sessions are removed from their storage tier.
- Confirmed logout clears auth keys from both storage tiers.
- Confirmed `login()` accepts the third `remember` parameter and writes expiry timestamps.

## Issues or concerns
- I performed a syntax check with `node --check utils/auth.js`; I did not run a browser-based end-to-end login flow in this environment.
