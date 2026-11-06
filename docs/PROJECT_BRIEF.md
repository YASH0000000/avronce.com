# AVRONCE Project Brief

## Project Identity & Overview
- **Brand Name**: AVRONCE
- **Domain**: avronce.com
- **Brand Tagline**: Modern Everyday Luxury & Trendsetter Fashion
- **Platform**: Next.js 16 (Turbopack) with React 19, Tailwind CSS v4, and Node.js
- **Payment Gateway**: Razorpay (Live Production Integration with Server-Side HMAC verification and webhooks)
- **Database Architecture**: Real-time unified JSON database abstraction (`src/data/store-db.json` & `src/lib/db.ts`) with Supabase dual-sync
- **Admin Portal**: Fully authenticated and customizable route (`/admin-avronce/` and `/admin`)

## Color Palette & Design Tokens
Derived directly from the official AVRONCE logo:
- **Obsidian Black / Onyx (`#000000`, `#09090b`, `#121214`)**: Dominant luxury background and dark surfaces.
- **Champagne Gold (`#D4AF37`, `#E5C07B`, `#F3E8C8`)**: Accents, buttons, badges, glows, active borders, and highlights.
- **Platinum Silver / Crisp White (`#FFFFFF`, `#F8FAFC`, `#E2E8F0`)**: Editorial typography and high-contrast text.

## Core Functional Modules
1. **Storefront**:
   - Header with rotating announcement ticker, search, mood navigation, live bag drawer, and quick admin portal link.
   - Dynamic Hero Banner with luxury slides and instant collection CTAs.
   - Curated category showcase: Chunky Boots, Mary Janes & Flats, Platform Heels, Romantic Dresses, Corset Tops, Matching Coords.
   - "Shop By Mood" filtering engine.
   - Product catalog with live search, price filter, and quick size picker (`Add to Bag`).
   - Single product pages with interactive image gallery, size guide modal, pincode delivery checker, and accordion details.
   - Slide-over Cart Drawer with free shipping progress threshold meter, coupon validation, and quantity adjusters.
   - Pan-India checkout with Cash on Delivery (COD) and Razorpay Secure Online payment options.
   - Real-time order tracking portal (`/track`).

2. **Admin Suite (`/admin-avronce/`)**:
   - Master Authentication Gate protecting all admin screens and endpoints.
   - Executive Dashboard with Gross GMV, order volume, status pipeline, and low stock warnings.
   - Product Catalog CRUD with multi-image gallery (upload, preview, reorder, primary selection, and removal).
   - Category Manager with product counters and storefront visibility toggles.
   - Order Fulfillment Manager with courier partner selection, AWB tracking ID updater, and printable packing slips.
   - Customer Directory with lifetime value and VIP tier calculation.
   - Real-Time Warehouse Inventory Monitor with inline quick quantity adjustments.
   - Coupons & Flash Offers Manager with percentage discounts and spend limits.
   - Storefront CMS Editor for rotating announcement tickers and hero banner slides.
   - Media Asset Library with instant "Copy Path" tool.
   - Store Settings with Admin Portal Link Customizer, Master Password Updater, and Search Console Verification.
