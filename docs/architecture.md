# ShopFlow — Architecture

ShopFlow is a demo e-commerce platform used as a practice codebase for software
engineering courses. It is a conventional two-tier web application: a REST API
backend and a React single-page application frontend.

## High-level diagram

```
┌────────────────────┐        HTTP/JSON         ┌───────────────────────────┐
│  React (Vite) SPA  │  ──────────────────────► │  Express REST API         │
│  port 5173         │                          │  port 4000                │
└────────────────────┘                          │  /api/v1/...              │
        │ proxied by Vite                       └────────────┬──────────────┘
        │ dev only                                          │ Sequelize ORM
        │                                                    ▼
                                              ┌───────────────────────────┐
                                              │  SQLite (dev) /           │
                                              │  PostgreSQL (prod, Docker)│
                                              └───────────────────────────┘
```

During local development Vite proxies `/api` and `/health` to the backend, so
the frontend can use relative URLs and no CORS configuration is required.

## Monorepo layout

```
shopflow/
├── backend/            Express + Sequelize REST API
│   ├── src/
│   │   ├── config/     Environment configuration + Sequelize connection
│   │   ├── models/     Sequelize model definitions (20 tables)
│   │   ├── migrations/ SQL migrations (Sequelize CLI)
│   │   ├── seeders/    Development seed data
│   │   ├── controllers/HTTP request handlers
│   │   ├── services/   Business logic
│   │   ├── middleware/ auth, validation, rate limiting, errors
│   │   ├── routes/     Express routers
│   │   ├── utils/      Helpers (pagination, money, tokens, cache)
│   │   └── server.js   Bootstrap
│   └── tests/          Jest unit + integration + legacy tests
├── frontend/           React (Vite) storefront + admin SPA
│   └── src/
│       ├── api/        Thin wrappers around the backend API
│       ├── context/    Auth + toast contexts
│       ├── components/ Shared UI components
│       ├── pages/      Storefront pages and admin screens
│       └── styles/     Global CSS
├── docs/               Documentation (this folder)
└── docker-compose.yml  Postgres + both services (optional)
```

## Backend layering

Requests flow through a standard layered architecture:

```
HTTP request
   │
   ▼
Middleware  ── requestId, helmet, cors, compression, body parsing, rate limit
   │
   ▼
Routes      ── validation (express-validator), auth guards (requireAuth, roles)
   │
   ▼
Controllers ── map HTTP concerns to service calls, shape responses
   │
   ▼
Services    ── business rules: pricing, orders, coupons, inventory, reports
   │
   ▼
Models      ── Sequelize ORM: data access, associations, model hooks
   │
   ▼
Database    ── SQLite (dev) / PostgreSQL (prod)
```

### Key service modules

| Module              | Responsibility                                             |
| ------------------- | ---------------------------------------------------------- |
| `authService`       | Register, login, refresh, logout, password reset           |
| `catalogService`    | Product listing, category filtering, featured products     |
| `searchService`     | Full-text-ish search across product names                  |
| `productService`    | Product CRUD, variants, low-stock, product detail cache    |
| `cartService`       | Cart lifecycle and line items                              |
| `orderService`      | Checkout, order lifecycle, inventory decrement             |
| `pricingService`    | Shipping, tax and coupon math                              |
| `couponService`     | Coupon validation and redemption                           |
| `paymentService`    | Simulated payment gateway                                  |
| `adminService`      | Dashboard stats and sales reports                          |
| `notificationService` | In-app notifications                                    |

## Authentication model

- **Access token**: JWT signed with `JWT_SECRET`, default 7 day expiry,
  carries `{ id, roleName }`.
- **Refresh token**: JWT with type `refresh`, default 30 day expiry.
- Passwords are hashed with bcrypt via a `beforeSave` hook on the `User` model.
- The `User` model has a default scope that excludes `passwordHash`; queries
  that need the hash (login) use `.unscoped()`.
- Roles are `admin`, `staff` and `customer`. Middleware `requireStaffOrAdmin`
  and `requireAdmin` gate admin routes.

## Frontend structure

The SPA uses **react-router-dom** for client-side routing. Public pages
(catalog, product detail, auth) are reachable without a token; cart, checkout,
orders and account require authentication; `/admin` requires a `staff` or
`admin` role.

State is managed with React context (`AuthContext`, `ToastContext`). API calls
go through `src/api/*` modules which wrap `fetch` and attach the bearer token
from `localStorage`.

## Conventions

- Money is always stored as integer **cents** (`*_cents` columns / fields).
- All endpoints are namespaced under `/api/v1`.
- Responses use a `{ data, meta }` envelope (see `docs/api.md`).
- Errors use a `{ error: { message, details?, debug? }, requestId }` envelope.
- Code is CommonJS on the backend (`require`) and ESM on the frontend
  (`import`).
- Timestamps are stored as UTC; some report code converts to local dates
  (see `docs/known-issues.md`).
