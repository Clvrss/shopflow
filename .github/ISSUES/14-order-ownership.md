---
title: Order detail endpoint ignores ownership
labels: ["bug", "P1", "orders", "security"]
---

**Describe the bug**
`getUserOrder()` queries by `id` only, so any authenticated user can read any
other user's order through `GET /api/v1/orders/:id`.

**Steps to reproduce**
1. User A places an order.
2. User B calls `GET /api/v1/orders/<A's order id>` with B's token.
3. A's order (address, items, totals) is returned.

**Expected behavior**
Order detail should be scoped to the requesting user (unless staff/admin).

**Covered by**
`tests/integration/orders.test.js` → "does not leak another users order through
the detail endpoint"

**Files**
- `backend/src/services/orderService.js`
- `backend/src/controllers/orderController.js`
