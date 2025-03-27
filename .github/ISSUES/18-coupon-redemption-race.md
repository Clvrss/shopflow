---
title: Coupon redemption is not atomic
labels: ["bug", "P1", "coupons", "reliability"]
---

**Describe the bug**
`validateCoupon()` checks `usesCount >= maxUses`, then `redeem()` increments
after the order is created. Under concurrency a coupon can be over-redeemed
past its usage limit.

**Expected behavior**
Redemption should be atomic (conditional update with a row lock or an atomic
`uses_count = uses_count + 1` guarded by the limit).

**Covered by**
`tests/integration/coupons.test.js` → "rejects a coupon once its usage limit is
reached" (currently only passes sequentially)

**Files**
- `backend/src/services/couponService.js`
