---
title: Customer can cancel a pending order
labels: ["enhancement", "orders", "good first issue"]
---

**Is your feature request related to a problem?**
Only admins can update order status, so a customer stuck with a mistaken
`pending` order has no self-service option.

**Describe the solution you'd like**
`POST /api/v1/orders/:id/cancel` — allowed only while status is `pending`, and
only by the owner (or staff). Stock should be returned.

**Acceptance criteria**
- [ ] Cancel works for the owner on `pending` orders
- [ ] Returns `409` for non-cancellable orders
- [ ] Stock is restored on cancel
- [ ] Audited (`audit_logs`)

**Files**
- `backend/src/services/orderService.js`
- `backend/src/controllers/orderController.js`
