---
title: Login crashes for accounts without a profile
labels: ["bug", "P1", "auth"]
---

**Describe the bug**
`authService.login()` writes `lastLoginAt` to `user.profile` without checking
that a profile row exists, so legacy accounts crash on login.

**Steps to reproduce**
1. `POST /api/v1/auth/login` with `maria@example.com` / `Password123!`
2. Server returns `500 Cannot set properties of null (setting 'lastLoginAt')`

**Expected behavior**
Accounts without a profile should log in normally (a profile should be created
or the update skipped).

**Actual behavior**
`500` crash; the account can never sign in.

**Relevant code**
`backend/src/services/authService.js` — `login()`

**Files**
- `backend/src/services/authService.js`
- Seed data: `maria@example.com` (customer with no profile row)
