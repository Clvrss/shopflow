# ShopFlow Web

React storefront for the ShopFlow e-commerce platform.

## Quick start

```bash
npm install
npm run dev
```

The dev server runs on http://localhost:5173 and proxies `/api` to the backend at
http://localhost:4000. Make sure the backend is running (`npm run dev` in `../backend`).

## Scripts

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build into `dist/`
- `npm run preview` — preview the production build
- `npm run lint` — ESLint over `src/`

## Structure

- `src/api/` — thin wrappers around the backend REST API
- `src/context/` — auth + toast React contexts
- `src/components/` — shared UI components
- `src/pages/` — route pages (storefront + admin)
- `src/styles/` — global stylesheet
