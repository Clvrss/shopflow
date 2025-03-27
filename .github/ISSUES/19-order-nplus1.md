---
title: Order list has N+1 queries
labels: ["bug", "P2", "orders", "performance"]
---

**Describe the bug**
`listUserOrders()` loops over orders to load their items, issuing one query per
order (25 orders = 26 queries). Page latency grows linearly.

**Expected behavior**
Eager-load items with a single `include`, or fetch in batches.

**Files**
- `backend/src/services/orderService.js`
