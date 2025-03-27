---
title: Concurrent cart adds can create duplicate lines
labels: ["bug", "P2", "cart"]
---

**Describe the bug**
`cartService.addItem()` checks for an existing line and then inserts. Two
concurrent requests for the same product can both pass the check and create
duplicate lines in the cart.

**Expected behavior**
Adding the same product + variant should upsert into a single line with a
combined quantity.

**Files**
- `backend/src/services/cartService.js`
