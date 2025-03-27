---
title: Product search: add filters and sorting
labels: ["enhancement", "catalog", "good first issue"]
---

**Is your feature request related to a problem?**
Search only supports a free-text `q`. Users cannot filter by category, price
range, brand or availability, or sort results.

**Describe the solution you'd like**
Extend `GET /api/v1/products` with:
- `category`, `minPrice`, `maxPrice`, `brand`, `inStock`
- `sort` = `price_asc | price_desc | newest | rating | relevance`

**Acceptance criteria**
- [ ] Filters combine with `q`
- [ ] Invalid sort values return `400`
- [ ] `meta` includes applied filters for the UI
- [ ] Documented in `docs/api.md`

**Files**
- `backend/src/services/productService.js`
- `backend/src/services/searchService.js`
- `backend/src/routes/product.routes.js`
