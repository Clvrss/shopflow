---
title: Search treats % and _ as SQL wildcards
labels: ["bug", "P2", "catalog"]
---

**Describe the bug**
`searchService.js` interpolates the user query directly into a LIKE pattern, so
`%` and `_` act as wildcards and match unintended rows.

**Steps to reproduce**
1. `GET /api/v1/products?q=100%25`
2. "USB-C 100W Charger" matches, even though it does not contain the literal
   string "100%".

**Expected behavior**
Search terms should be treated literally.

**Covered by**
`tests/integration/products.test.js` → "treats wildcard characters in search
terms literally"

**Files**
- `backend/src/services/searchService.js`
