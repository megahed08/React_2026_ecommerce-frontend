# Ecommerce Frontend

React + TypeScript + Vite storefront for the planned e-commerce application.

## Current scope

- Product catalog with search, category filtering, sorting, and product details
- Cart with quantity updates and order summary
- Simulated checkout flow
- Login/register mock flow with customer and admin role preview
- Admin product management with local mock data

The app currently uses in-memory mock data. The next milestone is to extract an API service layer and connect it to the Spring Boot backend.

## Project structure

```text
src/
  components/
    account/
    admin/
    cart/
    catalog/
    checkout/
    layout/
    ui/
  data/
  hooks/
  utils/
  App.tsx
  main.tsx
  types.ts
```

Reusable base UI primitives live in `src/components/ui`. Product mock images use real photo URLs selected to avoid obvious brand marks, with a base image fallback handled by `src/components/ui/Image.tsx`.

`App.tsx` is intentionally small. Screen composition lives in `src/components/layout/StorefrontLayout.tsx`; storefront behavior is composed in `src/hooks/useStorefront.ts` from smaller domain hooks for catalog, cart, account, and checkout.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm run typecheck
npm run build
```
