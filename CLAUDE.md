# Woodgrain & Sawdust — Claude Instructions

## Project
Woodworking cut plans store. Sells digital PDF cut plans — some paid (via Stripe), some free (with optional Buy Me a Coffee tip). No cart — each plan is a single-item purchase or free download. Auth is admin-only.

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **CMS:** Sanity (cut plans, images, PDFs, content)
- **Database:** Convex (orders — real-time)
- **Auth:** Clerk (admin-only, not required for browsing/purchasing)
- **Payments:** Stripe (single-item checkout for paid plans)
- **Tips:** Buy Me a Coffee (external link for free plan tips)

## Key Architecture Decisions
- **No sign-in for customers.** A `deviceId` (UUID in localStorage) identifies purchasers in Convex. Auth is only for the admin dashboard.
- **No cart.** Each plan has a direct "Buy Now" (paid) or "Download Free" button.
- **Sanity** manages cut plan content + PDF file storage; **Convex** manages orders.
- **ConvexProvider** (not ConvexProviderWithClerk) since purchases don't need auth.
- Plan images use Sanity's `urlFor()` builder from `@/src/sanity/lib/image`.
- **PDF security:** Paid plan PDFs are served through `/api/download` which verifies payment in Convex before proxying from Sanity CDN.

## Project Structure
```
app/
  layout.tsx              — Root: ClerkProvider > ConvexClientProvider
  (customer)/             — Public routes (no auth required)
    layout.tsx            — Header + Footer
    page.tsx              — Homepage with hero + featured plans
    plans/page.tsx        — Plans grid with category filter
    plans/[slug]/         — Plan detail (server component)
    order-confirmation/   — Post-purchase with download link
  api/
    checkout/route.ts     — Creates Stripe session for single plan
    download/route.ts     — Secure PDF download (verifies payment for paid plans)
    webhook/route.ts      — Proxies Stripe webhooks to Convex
  admin/                  — Protected admin routes
  studio/                 — Sanity CMS studio
components/
  customer/               — CutPlanCard, PlanActions, ProductGallery, AboutSection
  providers/              — ConvexClientProvider
  ui/                     — Header, AdminSidebar, shadcn components
hooks/
  useDeviceId.ts          — localStorage UUID for identifying purchasers
  usePlanCheckout.ts      — Single-plan Stripe checkout flow
convex/
  schema.ts               — Orders table (deviceId, planId, planName, price, status)
  orders.ts               — createPendingOrder, hasUserPurchasedPlan, processPaymentSuccess
  ordersInternal.ts       — Internal mutations for order fulfillment
  http.ts                 — Stripe webhook handler with signature verification
  email.ts                — Order confirmation emails via Resend
src/sanity/lib/
  client.ts, queries.ts, types.ts, image.ts
schemaTypes/
  cutPlan.ts              — Cut plan document (name, slug, price, pdfFile, difficulty, etc.)
  category.ts, heroSection.ts, aboutSection.ts
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

## User Flows
- **Paid plan:** Browse → Plan Detail → "Buy Now" → Stripe Checkout → Order Confirmation → Download PDF
- **Free plan:** Browse → Plan Detail → "Download Free" → PDF downloads → Optional "Buy Me a Coffee" tip
- **Re-download:** Plan Detail page checks `hasUserPurchasedPlan` via deviceId and shows "Download" button

## Running the Project
- `npm run dev` — Next.js dev server
- `npx convex dev` — Convex backend (run in separate terminal)
- Sanity Studio at `/studio`
