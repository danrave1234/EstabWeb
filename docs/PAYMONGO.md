# PayMongo Integration (Philippines)

**Stripe is not available in Philippines.** This project uses [PayMongo](https://www.paymongo.com) for payment processing in the PH market.

## Why PayMongo

- Philippines-based payment gateway
- Accepts GCash, Maya, GrabPay, ShopeePay, QR Ph, online banking, cards
- PCI DSS compliant
- Developer-friendly API with webhooks
- No setup or monthly fees; pay-per-transaction

## Setup

1. Create an account at [PayMongo Dashboard](https://dashboard.paymongo.com)
2. Generate API keys (test and live) from Settings — use **Secret Key** (`sk_test_` or `sk_live_`) for server
3. Add to `.env.local`:
   ```
   PAYMONGO_SECRET_KEY=sk_test_... or sk_live_...
   SUPABASE_SERVICE_ROLE_KEY=... (for webhook — bypasses RLS)
   PAYMONGO_WEBHOOK_SECRET=whsec_... (optional, for signature verification)
   ```
4. Run migration `docs/migrations/003_paymongo_links.sql` in Supabase
5. In PayMongo Dashboard → Webhooks, create webhook:
   - URL: `https://your-domain.com/api/paymongo/webhook`
   - Events: `link.payment.paid`, `payment.paid`
   - Copy the signing secret to `PAYMONGO_WEBHOOK_SECRET`

## Subscription Status Flow

- **free**: Client must submit for admin approval
- **trial**: Direct publish with limits (14 days)
- **active**: Paid client, direct publish with limits
- **admin_granted**: Admin granted access without payment

Publish limits: 50 per 30-day period, 3 per day (configurable per project).
