---
title: Request logging with correlation IDs
labels: ["enhancement", "observability", "medium"]
---

**Is your feature request related to a problem?**
Errors are logged but requests are not correlated, so tracing a failing order
across auth → cart → orders → payments requires manual guessing.

**Describe the solution you'd like**
- Middleware assigns a `requestId` (already in the error envelope) to every
  request and includes it in structured logs
- Access logs (morgan) include method, path, status, duration, requestId
- Errors attach `requestId` to their logger metadata

**Acceptance criteria**
- [ ] Every response exposes `requestId`
- [ ] Logs for the same request share the id
- [ ] 5xx responses log a full stack with the id

**Files**
- `backend/src/app.js`
- `backend/src/logger.js`
- `backend/src/middleware/`
