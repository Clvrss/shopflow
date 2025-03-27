---
title: Checkout is not transactional
labels: ["bug", "P1", "orders", "reliability"]
---

**Describe the bug**
`createOrder()` performs order creation, payment, stock decrement, coupon
redemption and cart cleanup as separate steps with no database transaction. A
failure halfway through leaves orphaned orders or inconsistent stock.

**Steps to reproduce**
1. Place an order.
2. Force a failure during the notification step (e.g. mail transport error).
3. The order exists and stock is decremented, but the caller sees an error and
   may retry, creating a duplicate order.

**Expected behavior**
The whole checkout should commit atomically or roll back entirely.

**Files**
- `backend/src/services/orderService.js`
- `backend/src/services/cartService.js`
