---
title: Admin revenue includes refunded orders
labels: ["bug", "P2", "admin"]
---

**Describe the bug**
The dashboard revenue query filters `payment_status IN ('paid','refunded')`, so
refunded orders inflate the revenue figure.

**Steps to reproduce**
1. Create an order and mark the payment `refunded`.
2. `GET /api/v1/admin/stats/dashboard` — revenue still counts it.

**Expected behavior**
Revenue should count only `paid` orders.

**Covered by**
`tests/integration/admin.test.js` → "excludes refunded orders from revenue
totals"

**Files**
- `backend/src/services/adminService.js`
