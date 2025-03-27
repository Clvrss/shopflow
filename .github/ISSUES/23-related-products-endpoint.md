---
title: Add related-products endpoint
labels: ["enhancement", "catalog", "good first issue"]
---

**Is your feature request related to a problem?**
The product page currently fills "You may also like" from the same category,
which is a client-side workaround with no relevance ordering.

**Describe the solution you'd like**
`GET /api/v1/products/:id/related` returning products sharing a category, brand,
or co-purchase history, ordered by relevance, with the current product excluded.

**Acceptance criteria**
- [ ] New endpoint returns related products (max 6)
- [ ] Never includes the requested product itself
- [ ] Documented in `docs/api.md`

**Files**
- `backend/src/routes/product.routes.js`
- `backend/src/controllers/productController.js`
- `backend/src/services/productService.js`
- `frontend/src/pages/ProductPage.jsx`
