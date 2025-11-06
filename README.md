# Roots Design Storefront

Roots Design is a React + TypeScript single-page experience powered by Vite. It showcases product collections, supports a lightweight shopping cart, and integrates responsive Cloudinary media.

## Prerequisites

- Node.js 18+
- npm 9+

Install dependencies once:

```sh
npm install
```

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Launch the Vite dev server with hot module replacement. |
| `npm run build` | Type-check (`tsc`) then create a production build. |
| `npm run preview` | Serve the built assets locally for QA. |
| `npm run lint` | Run ESLint across the codebase (`ts`, `tsx`). |

## Cart Feature Flag

Cart behaviour is controlled by the `VITE_CART_ENABLED` environment variable (defaults to `true` when unset). Place overrides in a `.env` file at the project root:

```env
# Disable cart, checkout, and quick-add UI
VITE_CART_ENABLED=false
```

Truthiness rules:

- Values like `false`, `0`, `off`, or `disabled` explicitly turn the cart off.
- Any other non-empty string keeps the cart on.

When disabled, `CartProvider` exposes a no-op context and the UI swaps to informational messaging (e.g., the `/cart` route renders “Cart Unavailable” and quick-add buttons disappear). Components should consume `useCart()` or `useCartEnabled()`—avoid importing the flag directly so future runtime toggles only touch the provider.

## Cloudinary Media

Product imagery uses Cloudinary public IDs. Ensure `VITE_CLOUDINARY_CLOUD` is set; otherwise local fallbacks and warnings appear. Images saved with cart items include their Cloudinary props, allowing the cart page to render thumbnails without re-querying product data.

## Project Structure

- `src/components` — UI modules (cart, layout, product cards, etc.).
- `src/Products` — product data and Cloudinary image helpers.
- `src/config/featureFlags.ts` — centralised feature flag resolution.
- `src/main.tsx` — app bootstrap and provider wiring.

## Development Notes

- The cart state persists in `localStorage` under `roots.design.cart`.
- Cloudinary helpers automatically generate responsive URLs and blur-up placeholders.
- ESLint is configured via `eslint.config.js` and runs with the custom TypeScript parser included in the repo—no additional setup required.
