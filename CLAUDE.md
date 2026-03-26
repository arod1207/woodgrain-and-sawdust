# Woodgrain & Sawdust — Claude Instructions

## Project
Woodworking cut plans site. Offers free digital PDF cut plans with a lead capture form (name + email) before downloads. Optional "Buy Me a Coffee" tip link on each plan. Auth is admin-only.

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **CMS:** Sanity (cut plans, images, PDFs, content)
- **Database:** Convex (downloads/leads — real-time)
- **Auth:** Clerk (admin-only, not required for browsing/downloading)
- **Tips:** Buy Me a Coffee (external link on plan pages)

## Key Architecture Decisions
- **No sign-in for customers.** Auth is only for the admin dashboard.
- **All plans are free.** No payments, no Stripe, no cart.
- **Lead capture:** A name + email form (shadcn Dialog) gates PDF downloads. Data stored in Convex `downloads` table.
- **Sanity** manages cut plan content + PDF file storage; **Convex** manages download leads.
- **ConvexProvider** (not ConvexProviderWithClerk) since downloads don't need auth.
- Plan images use Sanity's `urlFor()` builder from `@/src/sanity/lib/image`.
- PDFs are served through `/api/download` which proxies from Sanity CDN.

## Project Structure
```
app/
  layout.tsx              — Root: ClerkProvider > ConvexClientProvider
  (customer)/             — Public routes (no auth required)
    layout.tsx            — Header + Footer
    page.tsx              — Homepage with hero + featured plans
    plans/page.tsx        — Plans grid with category filter
    plans/[slug]/         — Plan detail (server component)
  api/
    download/route.ts     — PDF download (proxies from Sanity CDN)
  admin/                  — Protected admin routes
    page.tsx              — Dashboard (downloads, subscribers, plans)
    plans/                — Plan management
    leads/                — Collected leads (name, email, plan)
  studio/                 — Sanity CMS studio
components/
  customer/               — CutPlanCard, PlanActions, DownloadForm, ProductGallery, AboutSection
  providers/              — ConvexClientProvider
  ui/                     — Header, AdminSidebar, shadcn components
convex/
  schema.ts               — Downloads table (name, email, planId, planName, createdAt)
  downloads.ts            — recordDownload, getAllDownloadsAdmin, getAllDownloads, getDownloadStats
src/sanity/lib/
  client.ts, queries.ts, types.ts, image.ts
schemaTypes/
  cutPlan.ts              — Cut plan document (name, slug, pdfFile, difficulty, etc.)
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
- **Download:** Browse → Plan Detail → "Download Plan" → Enter name + email → PDF downloads → Optional "Buy Me a Coffee" tip

## Running the Project
- `npm run dev` — Next.js dev server
- `npx convex dev` — Convex backend (run in separate terminal)
- Sanity Studio at `/studio`
