# LIBER ❤️ — Installation, Configuration & Deployment Guide

## 1. Local Installation

```bash
cd liber-app
npm install
```

## 2. Running Locally (Zero-Config Demo Mode)

The app works out-of-the-box without external credentials using **Local Demo Mode** (persisted in `localStorage`, with an interactive Partner Simulator so you can test all Couple Match combinations immediately).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser or smartphone on the same network.

## 3. Connecting Supabase (Production Auth & Real-Time Couple Sync)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and run the entire contents of `supabase/schema.sql`.
3. Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart `npm run dev`. The app automatically detects Supabase credentials and enables real account sign-up/sign-in and partner linking via invite codes.

### Features Requiring Supabase Configuration
- Cross-device real-time couple sync between two separate smartphones.
- Persistent cloud authentication (`profiles`, `couples`, `mood_checkins`, `affection_messages`).
- Server-enforced PostgreSQL Row-Level Security (RLS) policies.

*In Local Demo Mode (without `.env.local`), all features—including the 64-question game, scoring/consent lock, Couple Match Mode, Quiz Roulette, SORPRÉNDEME, sound effects, privacy toggles, and data deletion—work locally in the browser.*

## 4. Running Automated Tests

```bash
npm test
```

Runs the unit test suite verifying:
- Scoring thresholds (`0–39`, `40–69`, `70–100`)
- Explicit `"No"` / `"Not now"` / `"Unsure"` consent guardrails (never overridden by high score)
- Manual state override behavior
- Couple Match Mode combinations & zero-pressure messaging

## 5. Production Build & Vercel Deployment

```bash
npm run build
npm start
```

To deploy to **Vercel**:
1. Push `liber-app` to GitHub/GitLab/Bitbucket.
2. Import the repository in [vercel.com](https://vercel.com), set Root Directory to `liber-app` (if in a monorepo).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel Environment Variables.
4. Deploy!
