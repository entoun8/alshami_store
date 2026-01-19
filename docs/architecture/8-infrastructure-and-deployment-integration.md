# 8. Infrastructure and Deployment Integration

## Existing Infrastructure

| Aspect | Current State |
|--------|---------------|
| **Current Deployment** | Development only (`npm run dev` on localhost:3000) |
| **Infrastructure Tools** | None configured for production |
| **Environments** | Development only |
| **Database** | Supabase hosted (ap-southeast-2 region, project: qfsgcdkalznxfrwnmnnp) |
| **Storage** | Not configured (images currently in `/public/images/`) |

## Enhancement Deployment Strategy

### Target Infrastructure

| Component | Service | Region | Notes |
|-----------|---------|--------|-------|
| **Application** | Vercel | Auto (Edge) | Next.js optimized hosting |
| **Database** | Supabase | ap-southeast-2 | Existing project, no change |
| **Storage** | Supabase Storage | ap-southeast-2 | New `products` bucket |
| **Email** | Resend | N/A (API) | Transactional email service |
| **Payments** | Stripe | N/A (API) | Existing, switch to live keys |
| **Auth** | Google OAuth | N/A | Update redirect URIs for production |

### Deployment Approach

**Strategy:** Single production environment with Vercel

| Phase | Action |
|-------|--------|
| **1. Pre-deployment** | Complete all stories 1.1-1.9 in development |
| **2. Environment Setup** | Configure Vercel project with environment variables |
| **3. Domain Configuration** | Set up custom domain with HTTPS (Vercel handles SSL) |
| **4. External Services** | Update Google OAuth URIs, configure Stripe webhook, verify Resend domain |
| **5. Deployment** | Connect GitHub repo to Vercel, deploy main branch |
| **6. Verification** | E2E test: Browse → Cart → Checkout → Pay → Email |

### Infrastructure Changes Required

| Change | Details |
|--------|---------|
| **Vercel Project** | Create new Vercel project linked to GitHub repository |
| **Environment Variables** | Configure all env vars in Vercel dashboard (see table below) |
| **Custom Domain** | Configure domain DNS to point to Vercel |
| **Supabase Storage** | Create `products` bucket with public read access |
| **Stripe Webhook** | Configure webhook endpoint in Stripe Dashboard |
| **Resend Domain** | Verify sending domain for email deliverability |
| **Google OAuth** | Add production redirect URI to Google Cloud Console |

### Pipeline Integration

**Vercel Automatic Deployment:**

```
GitHub Push → Vercel Build → Deploy to Production
     │              │              │
     │              │              └── Automatic SSL
     │              │                  Edge distribution
     │              │
     │              └── next build
     │                  Type checking
     │                  Linting
     │
     └── main branch trigger
```

**Build Configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## Environment Variables Configuration

### Development (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qfsgcdkalznxfrwnmnnp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # Anon key (safe for client)
SUPABASE_SERVICE_ROLE_KEY=eyJ...      # Service role (server only) - NEW

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-dev-secret

# Google OAuth
AUTH_GOOGLE_ID=xxx.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=xxx

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx       # NEW

# Resend - NEW
RESEND_API_KEY=re_xxx
EMAIL_FROM_ADDRESS=orders@localhost   # Or use Resend test address

# App
SERVER_URL=http://localhost:3000
```

### Production (Vercel Environment Variables)

| Variable | Value | Scope |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qfsgcdkalznxfrwnmnnp.supabase.co` | Client + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key from Supabase | Client + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key from Supabase | **Server only** |
| `NEXTAUTH_URL` | `https://your-domain.com` | Server |
| `NEXTAUTH_SECRET` | Strong random secret (32+ chars) | Server |
| `AUTH_GOOGLE_ID` | Google OAuth client ID | Server |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret | Server |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_xxx` | Client + Server |
| `STRIPE_SECRET_KEY` | `sk_live_xxx` | **Server only** |
| `STRIPE_WEBHOOK_SECRET` | Production webhook secret | **Server only** |
| `RESEND_API_KEY` | `re_xxx` | **Server only** |
| `EMAIL_FROM_ADDRESS` | `orders@your-domain.com` | Server |
| `SERVER_URL` | `https://your-domain.com` | Server |

## Rollback Strategy

| Scenario | Rollback Method |
|----------|-----------------|
| **Deployment failure** | Vercel automatic rollback to previous deployment |
| **Runtime errors** | Vercel instant rollback via dashboard (one-click) |
| **Database migration issues** | Manual SQL rollback scripts (prepare before each migration) |
| **Feature issues** | Revert Git commit, push triggers new deployment |

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **RLS policies break existing functionality** | Test all CRUD operations thoroughly before production; prepare rollback SQL |
| **Stripe webhook fails in production** | Test with Stripe CLI locally; monitor Stripe Dashboard for failed webhooks |
| **Email delivery issues** | Resend provides delivery logs; order page shows status regardless of email |
| **Google OAuth redirect mismatch** | Test OAuth flow immediately after deployment; have redirect URIs ready |
| **Service role key exposure** | Never prefix with `NEXT_PUBLIC_`; verify in Vercel that it's server-only |

## Monitoring Approach

| Aspect | Tool | Implementation |
|--------|------|----------------|
| **Application Errors** | Vercel Analytics | Built-in, automatic |
| **Performance** | Vercel Speed Insights | Enable in Vercel dashboard |
| **Database** | Supabase Dashboard | Monitor queries, connections |
| **Email Delivery** | Resend Dashboard | Track delivery rates, bounces |
| **Payments** | Stripe Dashboard | Monitor webhook deliveries, payment success rates |
| **Uptime** | Vercel (or external) | Consider adding uptime monitor for critical paths |

## Pre-Deployment Checklist (Story 1.10)

- [ ] All stories 1.1-1.9 completed and tested locally
- [ ] `.env.example` created with all required variables (no values)
- [ ] Vercel project created and linked to GitHub
- [ ] All environment variables configured in Vercel
- [ ] Custom domain configured with DNS
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Google OAuth redirect URIs updated for production domain
- [ ] Stripe webhook endpoint configured: `https://your-domain.com/api/webhooks/stripe`
- [ ] Stripe switched to live mode (keys updated in Vercel)
- [ ] Resend domain verified for production email sending
- [ ] Supabase RLS policies enabled and tested
- [ ] Initial deployment successful
- [ ] E2E test completed: Browse → Add to Cart → Checkout → Pay → Receive Email
- [ ] Admin dashboard accessible and functional
- [ ] Performance acceptable (< 3s page loads)

---
