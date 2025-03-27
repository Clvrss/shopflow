---
title: Missing product returns 200 with a null body
labels: ["bug", "P1", "catalog", "api-contract"]
---

**Describe the bug**
`productController.detail()` returns `200 { data: null }` when a product does
not exist, instead of a `404`. Clients treat missing products as success and
show empty pages.

**Steps to reproduce**
1. `GET /api/v1/products/999999`
2. Returns `200` with `data: null`.

**Expected behavior**
`404` with a clear error message.

**Covered by**
`tests/integration/products.test.js` → "returns 404 when a product does not
exist"

**Files**
- `backend/src/controllers/productController.js`
