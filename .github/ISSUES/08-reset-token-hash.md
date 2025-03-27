---
title: Password reset token is compared to its own hash
labels: ["bug", "P2", "auth"]
---

**Describe the bug**
`resetPassword()` looks up `{ tokenHash: token }` where `token` is the raw token
sent to the user, so a freshly issued reset token is always rejected.

**Steps to reproduce**
1. Request a reset for an existing email.
2. `POST /api/v1/auth/reset-password` with the returned raw token.
3. Returns `400 Invalid or expired reset token`.

**Expected behavior**
The raw token should be hashed before the lookup.

**Covered by**
`tests/integration/auth.test.js` → "resets the password with a valid token"

**Files**
- `backend/src/services/authService.js`
