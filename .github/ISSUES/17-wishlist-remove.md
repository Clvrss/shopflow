---
title: Removing a wishlist item is a no-op
labels: ["bug", "P2", "wishlist"]
---

**Describe the bug**
The wishlist remove handler never actually deletes the row, so items remain in
the list after removal.

**Steps to reproduce**
1. Add a product to the wishlist.
2. `DELETE /api/v1/wishlist/:productId`
3. `GET /api/v1/wishlist` still contains the item.

**Expected behavior**
The item should be removed.

**Covered by**
`tests/integration/wishlist.test.js` → "removes a wishlist item"

**Files**
- `backend/src/services/wishlistService.js`
