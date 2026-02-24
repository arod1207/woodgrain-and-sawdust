# Woodgrain & Sawdust — Claude Instructions

## Project
Handcrafted woodworking e-commerce store. Customers browse/buy without signing in. Auth is admin-only.

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **CMS:** Sanity (products, images, content)
- **Database:** Convex (cart, orders, analytics — real-time)
- **Auth:** Clerk (admin-only, not required for shopping)
- **Payments:** Stripe (Phase 4 — not yet implemented)

## Key Architecture Decisions
- **No sign-in for customers.** Cart uses a `deviceId` (UUID in localStorage) to identify carts in Convex. Auth is only for the admin dashboard.
- **Sanity** manages product content; **Convex** manages transactional data (cart, orders).
- **ConvexProvider** (not ConvexProviderWithClerk) since cart doesn't need auth.
- Product images use Sanity's `urlFor()` builder from `@/src/sanity/lib/image`.

## Project Structure
```
app/
  layout.tsx              — Root: ClerkProvider > ConvexClientProvider > CartProvider
  (customer)/             — Public routes (no auth required)
    layout.tsx            — Header + Footer
    page.tsx              — Homepage with hero + featured products
    products/page.tsx     — Product grid
    products/[slug]/      — Product detail (server component)
    cart/page.tsx          — Cart page (client component)
  admin/                  — Protected admin routes
  studio/                 — Sanity CMS studio
components/
  customer/               — AddToCartButton, CartItem, CartSummary, ProductCard, ProductGallery
  providers/              — ConvexClientProvider, CartProvider
  ui/                     — Header, shadcn components (button, card, badge, separator, skeleton, avatar)
hooks/
  useCart.ts              — Re-exports useCart from CartProvider
convex/
  schema.ts               — Cart table (deviceId, items[], updatedAt)
  cart.ts                 — getCart, addToCart, updateQuantity, removeFromCart, clearCart
src/sanity/lib/
  client.ts, queries.ts, types.ts, image.ts
```

## Color Palette (defined in globals.css)
cream, cream-dark, amber, amber-light, walnut, walnut-dark, charcoal, charcoal-light, sage, sage-light

## Styling Conventions
- Use Tailwind utility classes
- shadcn/ui components for UI primitives
- Rounded-full for primary CTA buttons, amber bg with white text
- Prefer flex over grid (per user preference)

## Code Conventions
- Functional components with hooks
- TypeScript interfaces for all data structures
- Clear, descriptive variable names
- Separate components for each distinct UI section
- Server components by default; "use client" only when needed

## Phase Status
- Phase 1 (Auth + Routing): DONE
- Phase 2 (Product Display): DONE
- Phase 3 (Shopping Cart): DONE
- Phase 4 (Checkout + Stripe): IN PROGRESS
- Phases 5-8: Not started

## Running the Project
- `npm run dev` — Next.js dev server
- `npx convex dev` — Convex backend (run in separate terminal)
- Sanity Studio at `/studio`
