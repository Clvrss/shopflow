---
title: Email verification flow
labels: ["enhancement", "auth", "medium"]
---

**Is your feature request related to a problem?**
Accounts can be used immediately after registration with an unverified email.

**Describe the solution you'd like**
- `email_verified_at` on users (migration)
- Verification token issued at register; `GET /verify/:token` marks verified
- Login/checkout require a verified email
- Resend endpoint with rate limiting

**Acceptance criteria**
- [ ] New accounts are `unverified` until they click the link
- [ ] Unverified users cannot check out
- [ ] Resend is rate limited (see `rateLimiter.js`)

**Files**
- `backend/models/user.js`
- `backend/src/services/authService.js`
- `backend/src/routes/auth.routes.js`
- `backend/src/middleware/rateLimiter.js`
