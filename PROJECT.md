# Woodworking E-commerce Store

## Project Overview

A modern e-commerce platform to showcase and sell custom woodworking products. The site emphasizes elegant presentation of craftsmanship with high-quality images and detailed product information. Includes a comprehensive admin dashboard for managing business operations, tracking costs, revenue, and customer data.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS:** Sanity (product management, images, descriptions)
- **Database:** Convex (real-time data for cart, orders, analytics)
- **Auth:** Clerk (customer accounts + admin access control)
- **Payments:** Stripe (secure checkout and payment processing)
- **Deployment:** Vercel (to be configured)

## Core Features

### Customer-Facing Features

- **Product Gallery:** Grid layout showcasing woodworking pieces with large, high-quality images
- **Product Details:** Individual pages with multiple photos, dimensions, wood type, finish, price
- **Shopping Cart:** Persistent cart with quantity adjustments
- **Checkout:** Streamlined checkout flow with Stripe integration
- **Order Confirmation:** Success page with order details and email confirmation

### Admin Dashboard Features

- **Product Management:** Add, edit, delete products via Sanity Studio
- **Order Management:** View all orders, update status (pending, shipped, delivered)
- **Financial Overview:**
  - Total revenue (daily, weekly, monthly)
  - Cost tracking per product (materials, labor hours)
  - Profit margin calculations
  - Revenue charts and trends
- **Customer Details:**
  - Customer list with order history
  - Contact information
  - Shipping addresses
  - Lifetime value
- **Inventory Tracking:** Stock levels, low inventory alerts (future enhancement)

## Project Structure

```
woodworking-store/
├── app/
│   ├── (customer)/          # Customer-facing routes
│   │   ├── page.tsx         # Home page / Featured products
│   │   ├── products/        # Product listing and details
│   │   ├── cart/            # Shopping cart
│   │   └── checkout/        # Checkout flow
│   ├── admin/               # Admin dashboard (protected)
│   │   ├── dashboard/       # Overview with revenue/costs
│   │   ├── products/        # Product management
│   │   ├── orders/          # Order management
│   │   └── customers/       # Customer details
│   ├── api/                 # API routes
│   │   ├── stripe/          # Stripe webhooks
│   │   └── convex/          # Convex endpoints
│   └── layout.tsx           # Root layout
├── components/
│   ├── customer/            # Customer-facing components
│   │   ├── ProductCard.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── CartItem.tsx
│   │   └── CheckoutForm.tsx
│   ├── admin/               # Admin components
│   │   ├── RevenueChart.tsx
│   │   ├── OrderTable.tsx
│   │   ├── CostBreakdown.tsx
│   │   └── CustomerList.tsx
│   └── ui/                  # Shared UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── lib/
│   ├── sanity/              # Sanity client and queries
│   │   ├── client.ts
│   │   ├── queries.ts
│   │   └── schemas/
│   ├── convex/              # Convex helpers
│   │   ├── functions.ts
│   │   └── schema.ts
│   ├── stripe/              # Stripe utilities
│   │   └── client.ts
│   └── utils/               # Helper functions
│       ├── formatCurrency.ts
│       └── calculateProfit.ts
├── sanity/                  # Sanity Studio configuration
└── convex/                  # Convex backend functions
```

## Environment Variables

Create a `.env.local` file with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token

# Convex Database
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOY_KEY=your_deploy_key

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

## Data Models

### Product (Sanity Schema)

```typescript
{
  name: string // e.g., "Walnut Coffee Table"
  slug: string // URL-friendly name
  description: string // Detailed description
  price: number // Selling price
  cost: number // Material + labor cost (admin only)
  images: array // Multiple product photos
  woodType: string // e.g., "Walnut", "Oak", "Maple"
  dimensions: {
    length: number
    width: number
    height: number
    unit: string // "inches" or "cm"
  }
  finish: string // e.g., "Oil finish", "Polyurethane"
  inStock: boolean
  featured: boolean // Show on homepage
  category: string // "Tables", "Chairs", "Shelving", etc.
}
```

### Order (Convex Schema)

```typescript
{
  orderId: string;
  customerId: string;        // Clerk user ID
  customerEmail: string;
  items: array;              // Products and quantities
  subtotal: number;
  shipping: number;
  total: number;
  status: string;            // "pending", "paid", "shipped", "delivered"
  shippingAddress: object;
  stripePaymentId: string;
  createdAt: timestamp;
  shippedAt?: timestamp;
}
```

### Cart (Convex Schema)

```typescript
{
  userId: string;            // Clerk user ID
  items: [
    {
      productId: string;
      quantity: number;
      price: number;         // Price at time of adding
    }
  ];
  updatedAt: timestamp;
}
```

## Design Principles

### Visual Design

- **Elegant & Minimal:** Let the woodworking craftsmanship be the focus
- **High-Quality Images:** Large photos with zoom capability
- **Natural Color Palette:** Earth tones, wood textures
- **Clean Typography:** Readable, professional fonts
- **Responsive:** Mobile-first, works beautifully on all devices

### Code Quality

- **Clean & Readable:** Well-organized, easy to understand
- **Component-Based:** Each section is its own component
- **TypeScript:** Fully typed for reliability
- **Commented:** Complex logic explained in simple terms
- **Modular:** Reusable components and utilities

## Development Phases

### ✅ Phase 1: Foundation & Setup

**Goal:** Get the project running and authentication working

Tasks:

- [ ] Initialize Next.js with TypeScript
- [ ] Install and configure Clerk
- [ ] Set up basic routing (/, /products, /admin)
- [ ] Create main layout with navigation
- [ ] Test that you can sign in/out

**You're done when:** You can visit the site, sign in with Clerk, and see different pages.

---

### ✅ Phase 2: Product Display (Customer Side)

**Goal:** Customers can browse and view your woodworking products

Tasks:

- [ ] Set up Sanity project and schema for products
- [ ] Add 2-3 test products in Sanity with images
- [ ] Create product gallery page (grid of products)
- [ ] Build individual product detail page
- [ ] Connect Sanity to Next.js and display real data

**You're done when:** You can see your products on the website, click one, and view details.

---

### ✅ Phase 3: Shopping Cart

**Goal:** Customers can add items to cart and view it

Tasks:

- [ ] Set up Convex project and schema for cart
- [ ] Create "Add to Cart" button on product pages
- [ ] Build cart page showing all items
- [ ] Add ability to update quantities
- [ ] Add ability to remove items
- [ ] Cart persists (survives page refresh)

**You're done when:** You can add products, see them in cart, change quantities, and it saves.

---

### ✅ Phase 4: Checkout & Payments

**Goal:** Customers can complete purchases

Tasks:

- [ ] Create checkout page with shipping form
- [ ] Set up Stripe account and get API keys
- [ ] Integrate Stripe checkout
- [ ] Create order confirmation page
- [ ] Set up webhook to save orders in Convex
- [ ] Test a real payment (use Stripe test mode)

**You're done when:** You can complete a full purchase flow from cart to confirmation.

---

### ✅ Phase 5: Admin Dashboard - Orders

**Goal:** You can see and manage customer orders

Tasks:

- [ ] Create admin route (protected by Clerk)
- [ ] Build orders list page
- [ ] Show order details (customer, items, total)
- [ ] Add order status updates (pending → shipped → delivered)
- [ ] Display order timeline

**You're done when:** After a test purchase, you can see it in admin and update its status.

---

### ✅ Phase 6: Admin Dashboard - Revenue & Costs

**Goal:** Track your business finances

Tasks:

- [ ] Add cost field to Sanity product schema
- [ ] Create revenue overview page (total sales)
- [ ] Build revenue chart (sales over time)
- [ ] Calculate and display profit per order
- [ ] Show total revenue vs. total costs
- [ ] Create "best sellers" list

**You're done when:** You can see how much money you're making and what it costs.

---

### ✅ Phase 7: Admin Dashboard - Customers

**Goal:** Understand your customer base

Tasks:

- [ ] Create customers page
- [ ] List all customers with order count
- [ ] Show customer detail page (all their orders)
- [ ] Display customer lifetime value
- [ ] Show shipping addresses used

**You're done when:** You can click a customer and see their complete order history.

---

### ✅ Phase 8: Polish & Launch Prep

**Goal:** Make it production-ready

Tasks:

- [ ] Add loading spinners for all async operations
- [ ] Handle errors gracefully (show friendly messages)
- [ ] Optimize images for fast loading
- [ ] Test on mobile devices
- [ ] Test complete user flow (browse → buy → admin view)
- [ ] Set up production Stripe account
- [ ] Deploy to Vercel

```

## Notes for AI (Cursor)

When generating code:
- Use clear, descriptive variable names
- Prefer functional components with React hooks
- Create separate components for each distinct UI section
- Always define TypeScript interfaces for data structures
- Use Flex and not grids for styling

## Future Enhancements (Post-MVP)
- Customer reviews and ratings
- Wishlist functionality
- Email marketing integration
- Custom order requests form
- Blog/portfolio section
- Advanced analytics (conversion rates, popular products)
- Inventory management with low-stock alerts
```
