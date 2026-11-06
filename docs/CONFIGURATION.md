# AVRONCE Configuration Guide

## Environment Variables Reference

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client & Server | Public identifier required by the Razorpay Checkout SDK to open the payment modal. |
| `RAZORPAY_KEY_ID` | Server-Side | Public key used by server-side Razorpay SDK. |
| `RAZORPAY_KEY_SECRET` | Server-Side Only | Secret key used for order creation and HMAC-SHA256 signature verification. Never exposed to client. |
| `RAZORPAY_WEBHOOK_SECRET` | Server-Side Only | Secret key used to verify raw request signatures for incoming Razorpay webhooks. |
| `ADMIN_SESSION_SECRET` | Server-Side Only | Secret key used to sign and verify HMAC tokens for admin portal sessions. |
| `ADMIN_DEFAULT_PASSWORD` | Server-Side Only | Initial master password for new admin setups (default: `admin`). |
| `ADMIN_CUSTOM_PATH` | Server-Side Only | Default admin URL slug (default: `admin-avronce`). |
| `GOOGLE_SITE_VERIFICATION` | Server-Side / Metadata | Google Search Console verification token. |

## Data Persistence
- **Primary Database**: `src/data/store-db.json`
- **Data Access Layer**: `src/lib/db.ts`
- **Uploaded Media Assets**: `public/images/uploads/`
- **Brand Assets**: `public/images/avronce-logo.png`
