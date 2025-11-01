# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Build & Run
- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Type check with tsc and build for production
- `npm run build-no-errors` - Build even with TypeScript errors (same as build)
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run lint` - Run ESLint on all TypeScript/TSX files
- The project uses a custom TypeScript parser in `eslint.config.js` that transpiles code before linting
- ESLint ignores: `dist`, `build`, `node_modules`, `coverage`, `**/*.d.ts`, `src/stories/**`

### Supabase Types
- `npm run types:supabase` - Generate TypeScript types from Supabase schema
- Requires `$SUPABASE_PROJECT_ID` environment variable
- Outputs to `src/types/supabase.ts`

### Testing
- Cypress is installed but no test scripts are configured yet
- No test files exist in the codebase currently

## Project Architecture

### Tech Stack
- **React 18** with TypeScript and Vite
- **Routing**: React Router v6
- **UI Framework**: shadcn/ui (Radix UI + Tailwind CSS)
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS with CSS variables for theming
- **Component Dev**: Tempo Devtools for isolated component development
- **Backend**: Supabase integration (types generated via CLI)
- **Payment**: Stripe integration via custom EverShop gateway

### Key Architectural Patterns

#### Tempo Integration
The project uses Tempo Devtools for component development:
- Stories are in `src/stories/` (mirroring Storybook format)
- Tempo routes are dynamically loaded in `App.tsx` when `VITE_TEMPO=true`
- Typography system defined in `tempo.config.json`
- Stories use `// [build] library: 'shadcn'` comments to indicate component library

#### State Management
- **Cart State**: Global cart managed via React Context in `src/components/cart/CartContext.tsx`
  - Persists to localStorage under key `"roots.design.cart"`
  - Provides: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
  - Calculates: `totalItems`, `subtotal`
- **CartProvider** wraps the app in `main.tsx`

#### Component Organization
- `src/components/ui/` - shadcn/ui components (Radix-based primitives)
- `src/components/` - App-specific components (Header, ProductCard, etc.)
- `src/components/cart/` - Cart-related components and context
- `src/stories/` - Tempo stories for UI components
- `src/lib/` - Utility functions and integrations

#### Styling System
- Path alias: `@/` resolves to `./src/`
- `cn()` utility in `src/lib/utils.ts` merges Tailwind classes
- CSS variables for theming in `src/index.css`
- Tailwind config uses "new-york" shadcn style with slate base color

#### Stripe Payment Gateway
Located in `src/lib/evershop/stripe/`:
- Custom Stripe gateway implementation for EverShop
- Modules: `client.ts`, `config.ts`, `errors.ts`, `stripeGateway.ts`, `webhook.ts`, `types.ts`
- Exported as unified module via `index.ts`

### Application Structure
- **Homepage** (`src/components/home.tsx`): Multi-section landing page with hero, collections, new arrivals, about, and contact
- **Cart Page** (`src/components/CartPage.tsx`): Shopping cart and checkout
- **Routes**: `/` (home), `/cart` (cart page), plus dynamic Tempo routes

### TypeScript Configuration
- `strict: false` - Type checking is relaxed
- `noEmitOnError: false` - Build proceeds even with type errors
- Path mapping: `@/*` → `./src/*`
- Target: ES2020 with DOM libraries

### Environment Variables
- `VITE_TEMPO` - Enable/disable Tempo devtools routes
- `VITE_BASE_PATH` - Base path for production builds (defaults to `/` in dev)
- `SUPABASE_PROJECT_ID` - Required for generating Supabase types

### Adding shadcn/ui Components
Use the shadcn CLI with existing configuration in `components.json`:
```bash
npx shadcn@latest add <component-name>
```

### Important Notes
- TypeScript errors don't block builds (by design)
- Stories directory is excluded from ESLint
- The project uses React Router's basename from `import.meta.env.BASE_URL`
- Custom ESLint parser transpiles TypeScript before linting (doesn't use @typescript-eslint)
