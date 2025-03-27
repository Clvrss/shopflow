---
title: Tax is floored instead of rounded
labels: ["bug", "P3", "pricing"]
---

**Describe the bug**
`pricingService.taxFor()` uses `Math.floor`, which undercharges tax by up to a
cent per order. A subtotal of 15999 produces 1319 instead of 1320.

**Expected behavior**
Round to the nearest cent.

**Covered by**
`tests/unit/pricingService.test.js` → "rounds tax to the nearest cent"

**Files**
- `backend/src/services/pricingService.js`
