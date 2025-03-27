---
title: Sessions table is unused; refresh tokens not revocable
labels: ["bug", "P2", "auth", "security"]
---

**Describe the bug**
Login never writes to the `sessions` table and `logout()` is a no-op, so a
stolen refresh token stays valid until it expires and logout is only client-side.

**Expected behavior**
Issue sessions on login, revoke on logout, and reject refresh tokens whose
session has been revoked.

**Files**
- `backend/src/services/authService.js`
- `backend/src/routes/auth.routes.js`
- `backend/models/session.js` (exists but unused)
