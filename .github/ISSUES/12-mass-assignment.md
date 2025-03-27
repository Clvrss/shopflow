---
title: Mass assignment lets customers change their role
labels: ["bug", "P1", "security"]
---

**Describe the bug**
`userService.updateMe()` spreads the request body directly into
`User.update(...)`. A customer can escalate their own role by sending
`{ roleId: 1 }` (or change their `status`).

**Steps to reproduce**
1. `PATCH /api/v1/users/me` as a customer with body `{ "roleId": 1 }`.
2. Response shows `role` now `admin`.

**Expected behavior**
Only whitelisted profile fields should be updatable.

**Files**
- `backend/src/services/userService.js`
