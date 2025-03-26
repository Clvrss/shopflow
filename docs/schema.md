# ShopFlow — Database Schema

The database is managed with Sequelize (ORM) + migrations (Sequelize CLI).
Development uses SQLite; production uses PostgreSQL. All timestamps are stored
as `created_at` / `updated_at` and map to `createdAt` / `updatedAt` in the ORM.

There are **21 tables**. This document lists each with its important columns.
Money is stored as integer cents. Boolean and enum columns use snake_case in
the database and camelCase in the ORM (e.g. `is_active` ↔ `isActive`).

## Entity relationship overview

```
roles 1───n users 1───1 profiles
                1───n addresses
                1───1 carts 1───n cart_items n───1 products 1───n product_variants
                1───n wishlist_items n───1 products
                1───n coupon_redemptions n───1 coupons
                1───n orders 1───n order_items n───1 products
                       │  │
                       │  1───n payments
                       └──1───n notifications
products n───1 categories
products 1───n reviews n───1 users
orders n───1 coupons
users 1───n password_resets
users 1───n audit_logs
users 1───n sessions
```

## Tables

### roles
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| name | string(50) | unique: `admin`, `staff`, `customer` |
| description | string(255) | |

### users
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| email | string(255) | unique |
| password_hash | string(255) | bcrypt hash (excluded by default scope) |
| first_name / last_name | string(100) | |
| phone | string(30) | |
| role_id | FK → roles | |
| status | enum | `active` / `disabled` |

### profiles
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| user_id | FK → users | unique |
| bio | text | |
| avatar_url | string(500) | |
| locale | string(10) | default `en` |
| marketing_opt_in | boolean | |
| last_login_at | datetime | |

### addresses
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| user_id | FK → users | |
| label | string(50) | default `Home` |
| first_name / last_name | string(100) | |
| line1 / line2 | string(255) | |
| city | string(100) | |
| state | string(100) | |
| postal_code | string(20) | |
| country | string(2) | default `US` |
| is_default | boolean | |

### categories
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| name | string(100) | |
| slug | string(120) | unique |
| parent_id | FK → categories | nullable |
| sort_order | integer | |
| is_active | boolean | |

### products
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| sku | string(64) | unique |
| name | string(200) | |
| slug | string(220) | unique |
| description | text | |
| price_cents | integer | base price |
| category_id | FK → categories | nullable |
| brand | string(100) | nullable |
| featured | boolean | |
| is_active | boolean | |

### product_variants
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| product_id | FK → products | |
| sku | string(64) | unique |
| name | string(200) | e.g. "Large / Blue" |
| option1 / option2 | string(100) | variant dimensions |
| price_cents | integer | nullable → falls back to product |
| is_active | boolean | |

### inventory
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| product_id | FK → products | |
| variant_id | FK → product_variants | nullable (null = base product) |
| quantity | integer | |
| low_stock_threshold | integer | default 5 |

### carts
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| user_id | FK → users | unique |
| status | enum | `active` / `checked_out` |

### cart_items
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| cart_id | FK → carts | |
| product_id | FK → products | |
| variant_id | FK → product_variants | nullable |
| quantity | integer | |
| unit_price_cents | integer | snapshot at add time |

### coupons
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| code | string(50) | unique, stored uppercase |
| description | string(255) | |
| discount_type | enum | `percent` / `fixed` |
| discount_value | integer | percent (10 = 10%) or cents |
| min_subtotal_cents | integer | default 0 |
| max_uses | integer | nullable (unlimited) |
| uses_count | integer | default 0 |
| expires_at | datetime | nullable |
| is_active | boolean | |

### coupon_redemptions
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| coupon_id | FK → coupons | |
| user_id | FK → users | |
| order_id | FK → orders | |
| redeemed_at | datetime | |

### orders
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| order_number | string(32) | unique, `SF-YYYY-…` |
| user_id | FK → users | |
| address_id | FK → addresses | |
| coupon_id | FK → coupons | nullable |
| subtotal_cents / shipping_cents / tax_cents / discount_cents / total_cents | integer | |
| currency | string(3) | `USD` |
| status | enum | `pending`/`paid`/`shipped`/`delivered`/`cancelled`/`refunded` |
| payment_status | enum | `pending`/`paid`/`failed`/`refunded` |

### order_items
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| order_id | FK → orders | |
| product_id | FK → products | |
| variant_id | FK → product_variants | nullable |
| product_name | string(200) | snapshot |
| sku | string(64) | snapshot |
| unit_price_cents | integer | snapshot |
| quantity | integer | |
| total_cents | integer | |

### payments
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| order_id | FK → orders | |
| amount_cents | integer | |
| method | enum | `card`/`paypal`/`bank_transfer`/`klarna` |
| gateway | string(50) | `simulated` |
| status | enum | `pending`/`succeeded`/`failed`/`refunded` |
| transaction_id | string(100) | |

### reviews
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| user_id | FK → users | |
| product_id | FK → products | |
| rating | integer | 1–5 |
| title | string(120) | |
| body | text | |
| is_approved | boolean | |

### wishlist_items
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| user_id | FK → users | |
| product_id | FK → products | |
| created_at | datetime | |

### notifications
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| user_id | FK → users | |
| type | string(50) | e.g. `order_placed` |
| title | string(200) | |
| body | text | |
| link | string(255) | |
| read_at | datetime | nullable |

### password_resets
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| user_id | FK → users | |
| token_hash | string(64) | sha256 of the raw token |
| expires_at | datetime | |
| used_at | datetime | nullable |

### audit_logs
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| actor_user_id | FK → users | nullable (system actions) |
| action | string(100) | e.g. `order.create` |
| entity_type | string(100) | |
| entity_id | integer | |
| before / after | json | snapshot |
| ip | string(45) | |

### sessions
| Column | Type | Notes |
| ------ | ---- | ----- |
| id | PK | |
| user_id | FK → users | |
| token_hash | string(64) | |
| ip / user_agent | string | |
| expires_at | datetime | |
| revoked_at | datetime | nullable |

> Note: `sessions` is currently populated nowhere — tokens are not revocable
> server-side (see `docs/known-issues.md`).

## Indexes

- `products`: unique `sku`, unique `slug`
- `product_variants`: unique `sku`, index on `product_id`
- `inventory`: index on `product_id`, index on `variant_id`
- `cart_items`: indexes on `cart_id`, `product_id`
- `order_items`: index on `order_id`
- `coupon_redemptions`: indexes on `coupon_id`, `user_id`, `order_id`
- `reviews`: index on `product_id`
- `notifications`: index on `user_id`
- `audit_logs`: index on `entity_type`, `entity_id`
- search migration adds an index used by name-based product search
