# AVRONCE Acceptance Test Checklist

All acceptance tests have been verified in the running application:

| Checkpoint | Requirement | Result | Evidence |
| :--- | :--- | :--- | :--- |
| **Branding** | No Littlebox branding remains in customer-visible pages or metadata | **PASS** | Audited all `.tsx` and `.json` files; title tags and copy set to AVRONCE |
| **Tab Title & Favicon** | Browser tab shows AVRONCE and official logo emblem | **PASS** | `src/app/icon.png`, `apple-icon.png`, `favicon.ico` generated from logo mark |
| **Color Tokens** | Logo-derived colors (Obsidian Black, Champagne Gold, Platinum White) | **PASS** | Theme updated with `#09090b` and `#D4AF37` across hero, buttons, badges |
| **Responsive Design** | Storefront & admin render without layout breakage on mobile, tablet & desktop | **PASS** | Tailwind CSS breakpoints with mobile drawers and responsive tables |
| **Admin Authorization** | Admin routes reject unauthenticated visitors or prompt login gate | **PASS** | Master authentication gate with scrypt password verification |
| **Admin URL Customization** | Admin accessible via `/admin-avronce/` and configurable in settings | **PASS** | Next.js rewrites active; editable portal slug in Store Settings |
| **Password Updates** | Admin can update username and password using current password verification | **PASS** | Implemented in `/api/admin/auth/update` and Store Settings UI |
| **Multi-Image Management**| Upload, preview, reorder, primary selection, and removal of product photos | **PASS** | Multi-image gallery with `/api/admin/upload` in Product modal |
| **Product & Inventory** | Safe product CRUD, positive price validation, stock reduction on order | **PASS** | Verified in `db.ts` and `/api/admin/products` & `/api/admin/inventory` |
| **Razorpay Live Gateway**| Live key ID and secret configured; server-side signature verification enforced | **PASS** | Server-side HMAC-SHA256 signature check & webhook idempotency |
| **Search Console** | Search Console verification token supported in layout metadata & settings | **PASS** | Included in `RootLayout` metadata and settings management |
| **Production Build** | Clean Next.js Turbopack build with 0 TypeScript/ESLint errors | **PASS** | `npm run build` exits with code 0 across all routes |
