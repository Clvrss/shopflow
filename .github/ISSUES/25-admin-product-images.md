---
title: Admin product images
labels: ["enhancement", "admin", "catalog"]
---

**Is your feature request related to a problem?**
Products have no image support at all — no column, no upload, no CDN.

**Describe the solution you'd like**
- `image_url` column(s) on products (migration required)
- Admin upload endpoint (multipart → local disk in dev, object storage in prod)
- Show thumbnails in the admin product list and on the storefront product card

**Acceptance criteria**
- [ ] Migration adds `image_url` (nullable) to products
- [ ] Admin can upload/replace an image
- [ ] Storefront renders images with a fallback placeholder

**Files**
- `backend/migrations/*`
- `backend/models/product.js`
- `backend/src/controllers/adminController.js`
- `frontend/src/components/ProductCard.jsx`
