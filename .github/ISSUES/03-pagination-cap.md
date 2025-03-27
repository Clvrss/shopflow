---
title: Pagination offset is silently capped at 100
labels: ["bug", "P3", "catalog"]
---

**Describe the bug**
`MAX_OFFSET = 100` in `paginate.js` means pages beyond `page = 10` (limit 10)
repeat the same rows instead of advancing.

**Steps to reproduce**
1. `GET /api/v1/products?page=10&limit=10`
2. `GET /api/v1/products?page=12&limit=10`
3. Both return overlapping rows from the same offset window.

**Expected behavior**
Deep pages must be addressable.

**Covered by**
`tests/unit/paginate.test.js` → "keeps deep pages addressable"

**Files**
- `backend/src/utils/paginate.js`
