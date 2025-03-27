---
title: Register accepts malformed emails and duplicate case variants
labels: ["bug", "P2", "auth"]
---

**Describe the bug**
The register route accepts `a@b` as a valid email, and `register()` does not
normalise (downcase/trim) addresses, so `User@x.com` and `user@x.com` can both
be created.

**Steps to reproduce**
1. `POST /api/v1/auth/register` with `email: "a@b"` → `201`.
2. Register `user@x.com` then `User@x.com` → both succeed.

**Expected behavior**
Malformed addresses are rejected (`422`) and emails are unique case-insensitively.

**Covered by**
`tests/integration/auth.test.js` → "rejects malformed addresses such as a@b"

**Files**
- `backend/src/routes/auth.routes.js`
- `backend/src/services/authService.js`
