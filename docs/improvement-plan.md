# High-Priority Fixes for the Marketplace Experience

## 1. Product imagery never updates per item
- **What happens:** `ProductGrid` passes each product's image through an `image` prop, but `ProductCard` looks for `imageUrl`. Because the prop names do not match, every card falls back to the default placeholder image instead of the real asset for that product. This makes the grid feel repetitive and hides the actual catalog.
- **What to fix:** Align the prop name (e.g., rename the prop in `ProductCard` to `image` or pass `imageUrl` from the grid) and tighten the TypeScript interfaces so the mismatch is caught during development.
- **Where to look:** `ProductCard` props (`imageUrl`) and its usage inside `ProductGrid` (`image`).

## 2. Filters ignore updated product data
- **What happens:** `ProductGrid` initializes `filteredProducts` from the incoming `products` prop once and never watches for updates. If you plug in real data from an API or CMS, the grid will stay stuck on the old array until the user presses a filter button.
- **What to fix:** Add an effect that syncs `filteredProducts` whenever `products` changes, and consider memoizing the category list so it reflects the actual catalog.
- **Where to look:** `useState` initializers and filter handling inside `ProductGrid`.

## 3. Navigation targets routes that do not exist yet
- **What happens:** The header advertises key marketplace sections (Collections, New Arrivals, About, Contact, Cart), but the router only registers the home page. Clicking these links sends shoppers to blank screens.
- **What to fix:** Define stub routes/components for the advertised pages or replace the `Link`s with proper anchors until those sections ship. This keeps trust high while you build out the rest of the marketplace flow.
- **Where to look:** Navigation link definitions inside `Header` and the top-level router (`App.tsx`).

---
Addressing the issues above will make the storefront feel intentional and production-ready: the catalog will show real merchandise, dynamic updates from your data source will work without manual refreshes, and customers will not get lost on dead-end pages.
