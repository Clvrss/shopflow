---
title: Stock decrement is a read-modify-write race (oversell)
labels: ["bug", "P1", "orders", "reliability"]
---

**Describe the bug**
Stock is read and then written back with `inventory.quantity -= n;
inventory.save()`. Two simultaneous checkouts can both pass the availability
check and oversell the last item.

**Expected behavior**
Use an atomic conditional update, e.g.
`UPDATE inventory SET quantity = quantity - n WHERE id = ? AND quantity >= n`.

**Files**
- `backend/src/services/orderService.js`
