---
title: Product cache is never invalidated on updates
labels: ["bug", "P2", "catalog"]
---

**Describe the bug**
`getProductById()` caches for 60s, but `updateProduct()` and `createVariant()`
never evict the cache key, so the storefront serves stale prices after admin
edits.

**Steps to reproduce**
1. View a product (it is cached).
2. Admin lowers its price.
3. Storefront keeps showing the old price for up to a minute.

**Expected behavior**
Mutations should invalidate the affected cache keys.

**Covered by**
`tests/unit/productService.test.js` → "returns updated product data immediately
after an update"

**Files**
- `backend/src/services/productService.js`
- `backend/src/utils/cache.js`
