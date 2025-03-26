# ShopFlow — Known Issues

This document tracks defects that are **deliberately left in the codebase** as
practice material. Each entry describes the symptom, where the defect lives,
how to reproduce it, and which test (if any) currently fails because of it.

> Teaching note: the test suite (`npm test` in `backend/`) has a mix of passing
> and failing tests. A failing test is the expected signal that a known issue
> exists. Fix the code, not the test.

Legend:
- **Severity**: 🔴 high / 🟠 medium / 🟡 low
- **Fix size**: S = a few lines, M = moderate refactor, L = larger refactor

---

## Authentication & accounts

### B01 — Login crashes for accounts without a profile 🔴 S
`backend/src/services/authService.js` — `login()` writes `lastLoginAt` to
`user.profile` without checking it exists.

- **Symptom**: logging in as a legacy account (e.g. `maria@example.com`) returns
  `500 Cannot set properties of null (setting 'lastLoginAt')`.
- **Reproduce**: `POST /api/v1/auth/login` with `maria@example.com` /
  `Password123!`.
- **Expected**: accounts without a profile should log in fine (or a profile
  should be created on login).
- **Covered by**: none currently — this is a latent crash.

### B08 — Password reset token is compared to the hash, not the raw token 🟠 S
`backend/src/services/authService.js` — `resetPassword()` looks up
`{ tokenHash: token }` where `token` is the raw token sent to the user.

- **Symptom**: a freshly issued reset token is always rejected (`400 Invalid or
  expired reset token`).
- **Reproduce**: create a `PasswordReset` row with a `token_hash`, then call
  `POST /api/v1/auth/reset-password` with the raw token.
- **Expected**: the raw token should be hashed before the lookup.
- **Covered by**: `tests/integration/auth.test.js` → "resets the password with
  a valid token".

### B20 — Loose email validation + no normalization 🟠 S
`backend/src/routes/auth.routes.js` — the register route accepts `a@b` as a
valid email; `authService.register()` does not downcase/trim the address.

- **Symptom**: `a@b` is accepted (`201`), and duplicate accounts can be created
  with case variations (`User@x.com` vs `user@x.com`).
- **Reproduce**: `POST /api/v1/auth/register` with `email: "a@b"`.
- **Expected**: `422` and normalised unique emails.
- **Covered by**: `tests/integration/auth.test.js` → "rejects malformed
  addresses such as a@b".

---

## Catalog & products

### B02 — Search wildcard characters are not escaped 🟠 S
`backend/src/services/searchService.js` — the LIKE clause interpolates the
user query directly, so `%` and `_` act as SQL wildcards.

- **Symptom**: searching for `100%` matches "USB-C 100W Charger".
- **Reproduce**: `GET /api/v1/products?q=100%25`.
- **Expected**: search terms should be treated literally.
- **Covered by**: `tests/integration/products.test.js` → "treats wildcard
  characters in search terms literally".

### B03 — Pagination offset is capped at 100 🟡 S
`backend/src/utils/paginate.js` — `MAX_OFFSET = 100` makes pages beyond
`page = 10` repeat the same rows.

- **Symptom**: `page=12&limit=10` returns the same rows as `page=10`.
- **Covered by**: `tests/unit/paginate.test.js` → "keeps deep pages addressable".

### B13 — Missing product returns 200 with a null body 🔴 S
`backend/src/controllers/productController.js` — `detail()` returns
`200 { data: null }` instead of `404` when a product is not found.

- **Symptom**: clients treat missing products as success.
- **Reproduce**: `GET /api/v1/products/999999` → `200`.
- **Covered by**: `tests/integration/products.test.js` → "returns 404 when a
  product does not exist".

### B15 — Product cache is never invalidated 🟠 M
`backend/src/services/productService.js` — `getProductById()` caches for 60s,
but `updateProduct()` and `createVariant()` never evict the cache key.

- **Symptom**: after an admin edits a product's price, the storefront keeps
  serving the stale price for up to a minute.
- **Covered by**: `tests/unit/productService.test.js` → "returns updated product
  data immediately after an update".

---

## Pricing

### B04 — Tax is floored, not rounded 🟡 S
`backend/src/services/pricingService.js` — `taxFor()` uses `Math.floor`, so
tax is always undercharged by up to a cent.

- **Reproduce**: subtotal `15999` → tax `1319` instead of `1320`.
- **Covered by**: `tests/unit/pricingService.test.js` → "rounds tax to the
  nearest cent".

### B05 — Free shipping only at over $50, not at $50 🟡 S
`backend/src/services/pricingService.js` — `shippingFor()` uses `>` instead of
`>=` for the free-shipping threshold.

- **Symptom**: an order of exactly `$50.00` is charged `$5.99` shipping.
- **Covered by**: `tests/unit/pricingService.test.js` → "offers free shipping at
  or above $50.00".

---

## Orders & checkout

### B09 — Checkout is not transactional 🔴 L
`backend/src/services/orderService.js` — `createOrder()` performs order creation,
payment, stock decrement and cart cleanup as separate steps with no transaction.

- **Symptom**: a failure halfway through (e.g. during stock decrement or
  notification) leaves orphaned orders, paid-but-not-confirmed orders, or
  decremented stock without an order.
- **Covered by**: none — needs a transaction + failure-injection test.

### B11 — Stock update is a read-modify-write race 🔴 M
`backend/src/services/orderService.js` — stock is read, then saved via
`inventory.quantity -= n; inventory.save()`. Two simultaneous checkouts can
both pass the stock check and oversell.

- **Covered by**: none — requires a concurrency test or an atomic
  `UPDATE ... SET quantity = quantity - n WHERE quantity >= n`.

### B14 — Order detail endpoint ignores ownership 🔴 S
`backend/src/services/orderService.js` — `getUserOrder()` queries by `id` only;
any authenticated user can read any order.

- **Symptom**: user B can fetch user A's order.
- **Covered by**: `tests/integration/orders.test.js` → "does not leak another
  users order through the detail endpoint".

### B19 — N+1 queries in the order list 🟠 M
`backend/src/services/orderService.js` — `listUserOrders()` loops over orders to
load items one query per order.

- **Symptom**: page of 25 orders = 26 queries; slow as order count grows.
- **Covered by**: none — needs an eager-load refactor with `include`.

---

## Cart

### B10 — Duplicate cart line race 🟠 M
`backend/src/services/cartService.js` — `addItem()` checks for an existing line
then inserts; two concurrent adds for the same product can create duplicate
lines.

- **Covered by**: none — needs an upsert or unique constraint + concurrency
  test.

---

## Coupons

### B18 — Coupon redemption is not atomic 🔴 M
`backend/src/services/couponService.js` — `validateCoupon()` checks
`usesCount >= maxUses`, then `redeem()` increments after the order is created.
Under concurrency, a coupon can be over-redeemed.

- **Covered by**: `tests/integration/coupons.test.js` → "rejects a coupon once
  its usage limit is reached" (passes sequentially; a concurrency test would
  expose the race).

---

## Wishlist

### B17 — Removing a wishlist item is a no-op 🟠 S
`backend/src/services/wishlistService.js` — the remove handler does not actually
delete the row (e.g. wrong predicate or missing `destroy`).

- **Symptom**: items stay in the wishlist after removal.
- **Covered by**: `tests/integration/wishlist.test.js` → "removes a wishlist
  item".

---

## Admin & reports

### B06 — Dashboard revenue includes refunded orders 🟠 S
`backend/src/services/adminService.js` — the revenue query filters
`payment_status IN ('paid','refunded')`.

- **Symptom**: refunded orders inflate revenue.
- **Covered by**: `tests/integration/admin.test.js` → "excludes refunded orders
  from revenue totals".

### B07 — "Today" uses local-time date() 🟡 S
`backend/src/services/adminService.js` — `formatDateLegacy()` uses the server's
local date while `created_at` is UTC.

- **Symptom**: near midnight the "today" revenue bucket is wrong / off by one
  day.
- **Covered by**: none — needs a fixed-timezone test.

### B22 — Sales CSV export returns 501 🟡 S
`backend/src/services/adminService.js` — `exportSalesReport()` throws
`notImplemented`.

- **Symptom**: `GET /api/v1/admin/reports/sales/export` → `501`.
- **Covered by**: `tests/integration/admin.test.js` → "returns 501 for the
  not-yet-implemented sales export".

---

## Security

### B12 — Mass assignment on user update 🟠 S
`backend/src/services/userService.js` — `updateMe()` spreads the request body
straight into `User.update(...)`.

- **Symptom**: a customer can escalate their own role (or change `status`) by
  sending `{ roleId: 1 }`.
- **Covered by**: none — needs an integration test that tries role escalation.

### B16 — Unbounded in-memory maps (cache + rate limiter) 🟡 M
`backend/src/utils/cache.js` and `backend/src/middleware/rateLimiter.js` — both
use plain `Map`s that never evict.

- **Symptom**: memory grows without bound under sustained traffic / unique keys.
- **Covered by**: none — needs TTL-based eviction or an LRU.

### B21 — Sessions table is unused; tokens not revocable 🟠 M
`backend/src/services/authService.js` — login never writes to `sessions`, and
`logout()` is a no-op.

- **Symptom**: a stolen refresh token stays valid until it expires; logout gives
  a false sense of security.
- **Covered by**: none — needs session rows + a revocation check in `refresh()`.

---

## Bug checklist

| ID  | Area         | Severity | Test that exposes it                                   |
| --- | ------------ | -------- | ------------------------------------------------------ |
| B01 | auth         | 🔴       | — (latent crash)                                       |
| B02 | search       | 🟠       | products: wildcards                                    |
| B03 | pagination   | 🟡       | paginate: deep pages                                   |
| B04 | pricing      | 🟡       | pricing: tax rounding                                  |
| B05 | pricing      | 🟡       | pricing: free shipping threshold                       |
| B06 | admin        | 🟠       | admin: revenue excludes refunds                        |
| B07 | admin        | 🟡       | — (timezone)                                           |
| B08 | auth         | 🟠       | auth: password reset                                   |
| B09 | orders       | 🔴       | — (transaction)                                        |
| B10 | cart         | 🟠       | — (concurrency)                                        |
| B11 | orders       | 🔴       | — (concurrency)                                        |
| B12 | users        | 🟠       | — (mass assignment)                                    |
| B13 | products     | 🔴       | products: 404                                          |
| B14 | orders       | 🔴       | orders: ownership                                      |
| B15 | products     | 🟠       | productService: cache                                  |
| B16 | platform     | 🟡       | — (memory)                                             |
| B17 | wishlist     | 🟠       | wishlist: remove                                       |
| B18 | coupons      | 🔴       | coupons: usage limit (sequential only)                 |
| B19 | orders       | 🟠       | — (N+1)                                                |
| B20 | auth         | 🟠       | auth: loose email                                      |
| B21 | auth         | 🟠       | — (sessions unused)                                    |
| B22 | admin        | 🟡       | admin: sales export 501                                |
