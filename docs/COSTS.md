# LIBER ❤️ — Cost Optimization, Platform Limits & SaaS Estimates

> **Important Notice:** All infrastructure numbers reflect researched 2025–2026 published tier limits and standard Mercado Pago Brasil / Uruguay rates. Operational cost projections at 100, 1,000, and 10,000 users are **estimates** based on typical couples-app usage and must be verified against your live billing dashboards before commercial launch.

---

## 1. Development Stage Costs (Non-Commercial Testing)

| Service | Tier | Monthly Cost | Key Limits & Conditions |
| :--- | :--- | :--- | :--- |
| **GitHub** | Free (Private Repo) | **$0** | Unlimited private repos, 2,000 CI/CD minutes/mo |
| **Vercel** | Hobby *(Non-Commercial Only)* | **$0** | 100 GB bandwidth/mo, 1M edge requests. **Strictly for personal/non-commercial dev & testing.** |
| **Supabase** | Free *(Prototyping)* | **$0** | 500 MB DB, 1 GB storage, 5 GB egress, 50,000 MAU. **Pauses after 7 days of inactivity; no automatic daily backups.** |
| **Mercado Pago** | Sandbox / Test | **$0** | No monthly fixed fee; test credentials only. |
| **Total Dev Stage** | | **$0 / month** | |

---

## 2. Commercial Launch Baseline Costs (Required for Paid SaaS)

| Service | Tier | Monthly Cost | Why Required for Commercial Launch |
| :--- | :--- | :--- | :--- |
| **Vercel** | Pro | **$20 / seat / month** | Vercel Terms of Service prohibit commercial/monetized apps on Hobby. Includes 1 TB bandwidth + commercial SLA. |
| **Supabase** | Pro | **$25 / month** | Removes 7-day auto-pause, includes **8 GB DB**, **50 GB egress**, **100,000 MAU**, and **daily automated backups**. |
| **Custom Domain** | `.com` / `.app` | **~$1 – $2 / month** (~$12–$20/yr) | Branded domain + HTTPS (auto-managed by Vercel). |
| **Transactional Email** | Resend / Postmark Free→Starter | **$0 – $15 / month** | Supabase built-in SMTP is rate-limited; custom SMTP recommended for auth & password recovery at scale. |
| **Total Baseline** | | **~$46 – $62 / month** | Before variable payment processing fees. |

---

## 3. Payment Processing Fees (Mercado Pago Brasil & Uruguay)

### 🇧🇷 Mercado Pago Brasil (BRL)
- **PIX:** ~**0.99%** per transaction (instant D+0).
- **Credit Card (Checkout Pro):** ~**3.98%** (30 days), ~**4.49%** (14 days), or ~**4.98%** (instant D+0).
- **Boleto Bancário:** Fixed fee per paid boleto (e.g., ~R$ 3.49).

### 🇺🇾 Mercado Pago Uruguay (UYU)
- **Checkout Pro & Subscriptions (Tarjetas, Abitab, Redpagos):**
  - **4.99% + IVA (22% on the commission)** for 21-day release (~6.09% effective).
  - **5.99% + IVA (22% on the commission)** for instant release (~7.31% effective).
- *Note:* Always confirm exact active rates in your Mercado Pago Business dashboard ("Tarifas e Preços" / "Comisiones y cuotas").

---

## 4. Estimated Monthly Costs by Scale

*Assumptions: 10% paid conversion rate, average revenue ~USD $4.50/user/mo (mix of BRL R$ 19,90 and UYU $U 290), ~5% blended Mercado Pago fee.*

| Metric | 100 Users | 1,000 Users | 10,000 Users |
| :--- | :--- | :--- | :--- |
| **Estimated Paid Users (10%)** | 10 | 100 | 1,000 |
| **Estimated Gross Revenue** | ~$45/mo | ~$450/mo | ~$4,500/mo |
| **Hosting (Vercel Pro)** | $20/mo | $20/mo | $20–$40/mo |
| **Database (Supabase Pro)** | $25/mo | $25/mo | $25–$50/mo (bandwidth/storage) |
| **Email & Domain** | $2/mo | $2–$15/mo | $15–$20/mo |
| **Mercado Pago Fees (~5%)** | ~$2.25/mo | ~$22.50/mo | ~$225/mo |
| **Estimated Total Cost** | **~$49/mo** | **~$70–$83/mo** | **~$285–$335/mo** |
| **Estimated Net Margin** | Break-even (~-$4) | **+~$367/mo** | **+~$4,165/mo** |

---

## 5. Free Commercial Hosting Recommendation (Cloudflare Pages + Mercado Pago Checkout Pro)

If you want to **sell commercially with $0/month hosting**, **Cloudflare Pages (Free Plan)** is recommended over Vercel Hobby:
- **Commercial Use:** Allowed on Cloudflare Pages Free (unlike Vercel Hobby, which prohibits commercial use).
- **Bandwidth:** Unlimited static bandwidth; up to **500 builds/month** and **100,000 Workers requests/day** (with 10 ms CPU limit per request).
- **Payment Compliance Rule:** Cloudflare Free prohibits processing raw credit card data directly on your site. Because LIBER uses **Mercado Pago Checkout Pro** (redirecting buyers to Mercado Pago's hosted checkout for PIX, Boleto, Abitab, Redpagos, and cards), your app never touches raw card numbers and stays compliant.
- **Alternative Portable Hosts:** Railway, Fly.io, or a $5–$10/mo VPS (Docker + Coolify).
