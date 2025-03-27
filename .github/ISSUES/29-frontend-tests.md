---
title: Add frontend tests (Vitest + Testing Library)
labels: ["enhancement", "frontend", "testing"]
---

**Is your feature request related to a problem?**
Only the backend has tests. The storefront has zero coverage of routes, forms
and auth state.

**Describe the solution you'd like**
- Vitest + @testing-library/react configured in `frontend`
- Smoke tests for: login form, product page (price rendering, 404 state),
  cart badge, `RequireAuth` redirect
- `npm test` script wired into the frontend

**Acceptance criteria**
- [ ] `frontend npm test` passes in CI
- [ ] AuthContext `RequireAuth` redirect is covered
- [ ] ApiError surfaces a user-facing message on the login page

**Files**
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/ProductPage.jsx`
