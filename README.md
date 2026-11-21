# LIBER ❤️ — El Semáforo del Amor / O Semáforo do Amor

Bilingual (Spanish & Brazilian Portuguese) SaaS application for adult couples (18+) to communicate romantic mood, affection preferences, energy, and openness to intimacy — respectfully, humorously, and without pressure.

## Tech Stack
- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Payments (Ready for Activation):** Mercado Pago Brasil (BRL / PIX, Cartão, Boleto) & Mercado Pago Uruguay (UYU / Tarjetas, Abitab, Redpagos)
- **Hosting:** Vercel (Hobby for non-commercial dev/testing; Pro required for commercial SaaS)
- **PWA:** Mobile-first responsive design with `manifest.json`

## Windows Local Setup

1. **Install Prerequisites:**
   - [Node.js 20+](https://nodejs.org/)
   - [Git for Windows](https://git-scm.com/download/win) (`winget install Git.Git`)
2. **Install Dependencies:**
   ```powershell
   cd liber-app
   npm install
   ```
3. **Run in Local Demo Mode (Zero Credentials Required):**
   ```powershell
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).
4. **Connect Supabase & Mercado Pago (Optional for Cloud/Payments):**
   - Copy `.env.example` to `.env.local` and fill in your credentials.
   - Run the SQL migrations in `supabase/migrations/` in order (`001_initial_saas_schema.sql`, then `002_seed_plans_flags_and_questions.sql`).

## Automated Tests & Quality Checks

```powershell
npm test          # Unit tests (scoring, consent locks, couple match, payment/competition guards)
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript check
npm run build     # Next.js production build
```

## Git Workflow (Main + Feature Branches)

```powershell
# Initialize (first time only, inside liber-app/)
git init
git branch -M main
git add .
git commit -m "chore: initial LIBER SaaS foundation"

# Develop on a feature branch
git checkout -b feat/mercadopago-checkout
git add .
git commit -m "feat: add Mercado Pago BR/UY checkout abstraction"

# Rollback / Restore examples
git checkout -- path/to/file      # Discard unstaged changes in a file
git revert <commit-hash>          # Safely revert a committed change on main
```

## Documentation
- [Market Research & Behavioral Studies](docs/MARKET_RESEARCH.md)
- [Product Requirements (PRD)](docs/PRD.md)
- [Visual Design System](docs/VISUAL_DESIGN.md)
- [Costs & Platform Limits (BR/UY SaaS)](docs/COSTS.md)
- [Vercel Deployment & Commercial Checklist](docs/VERCEL_DEPLOYMENT.md)
- [Backups & Maintenance Strategy](docs/BACKUPS_AND_MAINTENANCE.md)
