---
title: Free shipping only above $50, not at $50
labels: ["bug", "P3", "pricing"]
---

**Describe the bug**
`shippingFor()` uses `>` instead of `>=`, so a subtotal of exactly `$50.00`
(5000 cents) is still charged `$5.99` shipping.

**Expected behavior**
Free shipping at or above the $50 threshold.

**Covered by**
`tests/unit/pricingService.test.js` → "offers free shipping at or above
$50.00"

**Files**
- `backend/src/services/pricingService.js`
