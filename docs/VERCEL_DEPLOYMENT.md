# LIBER ❤️ — Vercel Deployment & Commercial Checklist

## 1. Commercial Hosting Rule (CRITICAL)
- **Vercel Hobby ($0)** is strictly for personal, non-commercial development and testing.
- **Before accepting real payments or launching commercially**, upgrade to **Vercel Pro ($20/seat/mo)** or migrate to a commercial-eligible host.

## 2. Connecting GitHub & Configuring Environments
1. Push `liber-app` to your private GitHub repository (`main` for production, `feat/*` for previews).
2. In Vercel: **Add New Project → Import `liber-app`**.
3. Configure **Environment Variables** in Vercel Project Settings (Production & Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` *(Server-only, Production/Preview)*
   - `NEXT_PUBLIC_ENABLE_COUPLE_COMPETITIONS=false`
   - `PAYMENTS_ENABLED=false` *(set `true` only after configuring Mercado Pago)*
   - `MP_ENVIRONMENT=sandbox` *(switch to `production` when live)*
   - `MP_ACCESS_TOKEN_BR` & `MP_ACCESS_TOKEN_UY`
   - `MP_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`

## 3. Auth & Webhook Callback URLs
- **Supabase Auth → URL Configuration:**
  - Site URL: `https://your-domain.com`
  - Redirect URLs: `https://your-domain.com/**`
- **Mercado Pago Webhooks:**
  - Brasil: `https://your-domain.com/api/webhooks/mercadopago?country=BR`
  - Uruguay: `https://your-domain.com/api/webhooks/mercadopago?country=UY`

## 4. Pre-Launch Checklist
- [ ] `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass.
- [ ] `ENABLE_COUPLE_COMPETITIONS` is `false`.
- [ ] Supabase RLS verified on all tables (`001_initial_saas_schema.sql` applied).
- [ ] Vercel Pro active if monetizing.
- [ ] Custom domain + HTTPS verified.

## 5. Rollback Procedure
- **Instant Vercel Rollback:** Vercel Dashboard → **Deployments** → select previous healthy production deployment → **Promote to Production**.
- **Git Rollback:** `git revert <bad-commit>` on `main` and push.
