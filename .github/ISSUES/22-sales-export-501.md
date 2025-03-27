---
title: Sales CSV export returns 501
labels: ["bug", "P3", "admin"]
---

**Describe the bug**
`GET /api/v1/admin/reports/sales/export` returns `501 Not implemented` instead
of a CSV file.

**Expected behavior**
Stream a CSV of order/line data for a date range (or document it as out of
scope).

**Covered by**
`tests/integration/admin.test.js` → "returns 501 for the not-yet-implemented
sales export"

**Files**
- `backend/src/services/adminService.js`
