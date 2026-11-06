# AVRONCE Implementation Plan

## Phase Overview

### Phase 0 — Baseline & Backup
- **Status**: Completed
- Source control initialized and clean branch established.
- Unified database schema verified at `src/data/store-db.json` and server abstraction at `src/lib/db.ts`.

### Phase 1 — Branding & Responsive UI
- **Status**: Completed
- Official AVRONCE logo installed at `public/images/avronce-logo.png`.
- Reusable `Logo.tsx` component updated with size controls (`sm`, `md`, `lg`, `xl`).
- Dynamic browser tab favicons generated:
  - `src/app/icon.png` (512x512)
  - `src/app/apple-icon.png` (180x180)
  - `public/favicon.ico` & `src/app/favicon.ico`
- Replaced all customer-visible Littlebox references with AVRONCE across pages, components, metadata, and legal text.
- Aligned typography and color tokens with the logo palette (Champagne Gold `#D4AF37` and Obsidian Black `#09090b`).

### Phase 2 — Admin Security & Account Protection
- **Status**: Completed
- Protected admin routes with server and client authorization gates.
- Configured dynamic route rewriting in `next.config.ts` for `/admin-avronce` and `/admin-avronce/:path*`.
- Stored admin security configuration with scrypt password hashing and HMAC-signed session tokens in `src/lib/db.ts`.
- Implemented `/api/admin/auth/login`, `/api/admin/auth/logout`, `/api/admin/auth/check`, and `/api/admin/auth/update`.
- Built Admin Settings interface enabling authorized administrators to change:
  - Portal URL slug (e.g. `admin-avronce`)
  - Admin username/email
  - Master password (requiring current-password verification)
  - Password protection toggle

### Phase 3 — Product Catalogue & Inventory Management
- **Status**: Completed
- Product CRUD with validation for positive prices and stock counts.
- Multi-image management:
  - Direct file upload endpoint at `/api/admin/upload` saving to `public/images/uploads/`.
  - In-modal gallery management: primary image selection, reordering, URL additions, and safe image removal.
- Archiving workflow allowing products with historical orders to be archived (`status: 'archived'`) without breaking order relationships.
- Real-time inventory adjustment with inline increment/decrement and instant database updates.

### Phase 4 — Live Razorpay & Google Search Console Verification
- **Status**: Completed
- Stored live Razorpay credentials securely in server-side `.env.local`:
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_TwZ6XcDwwdwirL`
  - `RAZORPAY_KEY_SECRET=hwC5bLIiU0FivkmjKpHeHYXD`
- Enforced server-side order creation (`/api/razorpay/create-order`) and HMAC-SHA256 signature verification (`/api/razorpay/verify-payment`).
- Built signed webhook endpoint at `/api/razorpay/webhook` with raw request body signature validation and idempotent state reconciliation.
- Added Google Search Console verification support via metadata in `src/app/layout.tsx` and Store Settings editor.

### Phase 5 — Quality Assurance & Release
- **Status**: Completed
- Turbopack production build verified: 32+ routes generated with zero errors.
- Endpoints verified with HTTP 200 responses.
- Documentation suite completed.
