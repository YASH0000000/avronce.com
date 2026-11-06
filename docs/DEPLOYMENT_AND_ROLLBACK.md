# AVRONCE Deployment & Rollback Guide

## Production Deployment Checklist

1. **Environment Variables Configuration**:
   Configure these variables in your hosting provider (Vercel, AWS, Railway, etc.):
   ```bash
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_TwZ6XcDwwdwirL
   RAZORPAY_KEY_ID=rzp_live_TwZ6XcDwwdwirL
   RAZORPAY_KEY_SECRET=hwC5bLIiU0FivkmjKpHeHYXD
   RAZORPAY_WEBHOOK_SECRET=your_configured_webhook_secret
   ADMIN_SESSION_SECRET=avronce_super_secure_admin_session_key_2026
   ADMIN_DEFAULT_PASSWORD=admin
   ADMIN_CUSTOM_PATH=admin-avronce
   ```

2. **Build & Start Commands**:
   - Build: `npm run build`
   - Start: `npm run start`

3. **Webhook Setup in Razorpay Dashboard**:
   - URL: `https://avronce.com/api/razorpay/webhook`
   - Subscribed events:
     - `payment.captured`
     - `payment.failed`
     - `refund.processed`
   - Copy Webhook Secret to environment variable `RAZORPAY_WEBHOOK_SECRET`.

4. **Google Search Console**:
   - Add property for `https://avronce.com`.
   - Copy the verification token into the **Store Settings** panel or set `GOOGLE_SITE_VERIFICATION` in hosting environment.

## Rollback Procedure
If any deployment requires rollback:
1. Revert to the previous git commit:
   ```bash
   git revert HEAD
   git push origin main
   ```
2. Database snapshots are preserved in `src/data/store-db.json`. A backup is automatically retained before any destructive schema update.
