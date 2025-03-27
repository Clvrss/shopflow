---
title: Pagination controls in the storefront
labels: ["enhancement", "frontend", "good first issue"]
---

**Is your feature request related to a problem?**
Product listing pages ignore `meta` pagination entirely; users can never browse
past the first page.

**Describe the solution you'd like**
- Pagination component wired to `meta` (page/limit/totalPages)
- Scroll-to-top on page change
- Works for search and category views

**Acceptance criteria**
- [ ] Next/Previous + page numbers render from `meta`
- [ ] URL reflects the current page (`?page=2`) and is shareable

**Files**
- `frontend/src/pages/HomePage.jsx`
- `frontend/src/components/Pagination.jsx`
