-- ============================================================================
-- LIBER ❤️ — Migration 001: Complete Commercial SaaS Schema & RLS Policies
-- PostgreSQL / Supabase
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  avatar_emoji text not null default '💖',
  role text not null default 'user' check (role in ('user', 'admin')),
  is_adult_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- Helper function: check admin role safely via JWT/profile (defined after profiles exists)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. USER PREFERENCES
-- ----------------------------------------------------------------------------
create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  language text not null default 'es' check (language in ('es', 'pt-BR')),
  country_code text not null default 'UY' check (country_code in ('BR', 'UY')),
  sound_enabled boolean not null default true,
  share_mood_default boolean not null default true,
  share_affection_default boolean not null default true,
  share_energy_default boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.user_preferences enable row level security;

create policy "user_preferences_own_all" on public.user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 3. COUPLES, COUPLE_MEMBERS & COUPLE_INVITATIONS
-- ----------------------------------------------------------------------------
create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  team_name text,
  competitions_opt_in boolean not null default false,
  history_opt_in_complete boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.couple_members (
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  history_opt_in boolean not null default false,
  competitions_opt_in boolean not null default false,
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id)
);

create index if not exists idx_couple_members_user on public.couple_members(user_id);

create table if not exists public.couple_invitations (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  invite_code text unique not null check (char_length(invite_code) between 6 and 16),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.couple_invitations enable row level security;

create policy "couples_member_select" on public.couples
  for select using (
    exists (
      select 1 from public.couple_members cm
      where cm.couple_id = couples.id and cm.user_id = auth.uid()
    )
  );

create policy "couples_insert_authenticated" on public.couples
  for insert with check (auth.uid() is not null);

create policy "couples_member_update" on public.couples
  for update using (
    exists (
      select 1 from public.couple_members cm
      where cm.couple_id = couples.id and cm.user_id = auth.uid()
    )
  );

create policy "couple_members_select_same_couple" on public.couple_members
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from public.couple_members cm2
      where cm2.couple_id = couple_members.couple_id and cm2.user_id = auth.uid()
    )
  );

create policy "couple_members_insert_self" on public.couple_members
  for insert with check (user_id = auth.uid());

create policy "couple_members_update_self" on public.couple_members
  for update using (user_id = auth.uid());

create policy "couple_members_delete_self" on public.couple_members
  for delete using (user_id = auth.uid());

create policy "couple_invitations_manage_own" on public.couple_invitations
  for all using (inviter_id = auth.uid()) with check (inviter_id = auth.uid());

create policy "couple_invitations_lookup_pending" on public.couple_invitations
  for select using (status = 'pending' and expires_at > now());

-- Allow linked partners to view basic profile (display_name, avatar_emoji)
create policy "profiles_partner_basic_select" on public.profiles
  for select using (
    exists (
      select 1
      from public.couple_members cm_me
      join public.couple_members cm_partner on cm_me.couple_id = cm_partner.couple_id
      where cm_me.user_id = auth.uid() and cm_partner.user_id = profiles.id
    )
  );

-- ----------------------------------------------------------------------------
-- 4. BILINGUAL QUESTION BANK (questions, translations, answer_options)
-- ----------------------------------------------------------------------------
create table if not exists public.questions (
  id text primary key,
  category text not null,
  is_direct_preference boolean not null default false,
  is_premium boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.question_translations (
  question_id text not null references public.questions(id) on delete cascade,
  language text not null check (language in ('es', 'pt-BR')),
  prompt text not null,
  primary key (question_id, language)
);

create table if not exists public.answer_options (
  id text primary key,
  question_id text not null references public.questions(id) on delete cascade,
  emoji text not null,
  points integer not null check (points between 0 and 100),
  is_boundary_no boolean not null default false,
  is_unsure boolean not null default false,
  affection_tag text,
  sort_order integer not null default 0
);

create table if not exists public.answer_translations (
  option_id text not null references public.answer_options(id) on delete cascade,
  language text not null check (language in ('es', 'pt-BR')),
  label text not null,
  primary key (option_id, language)
);

alter table public.questions enable row level security;
alter table public.question_translations enable row level security;
alter table public.answer_options enable row level security;
alter table public.answer_translations enable row level security;

create policy "questions_read_all" on public.questions for select using (is_active = true or public.is_admin());
create policy "questions_admin_write" on public.questions for all using (public.is_admin()) with check (public.is_admin());
create policy "question_translations_read_all" on public.question_translations for select using (true);
create policy "question_translations_admin_write" on public.question_translations for all using (public.is_admin()) with check (public.is_admin());
create policy "answer_options_read_all" on public.answer_options for select using (true);
create policy "answer_options_admin_write" on public.answer_options for all using (public.is_admin()) with check (public.is_admin());
create policy "answer_translations_read_all" on public.answer_translations for select using (true);
create policy "answer_translations_admin_write" on public.answer_translations for all using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. GAME SESSIONS, GAME ANSWERS, MOOD CHECKINS & SHARED RESULTS
-- ----------------------------------------------------------------------------
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null default 'quick' check (mode in ('quick', 'full', 'category', 'roulette')),
  score integer check (score between 0 and 100),
  computed_state text check (computed_state in ('ANTI_LIBER', 'CASI_LIBER', 'LIBER')),
  final_state text check (final_state in ('ANTI_LIBER', 'CASI_LIBER', 'LIBER')),
  boundary_lock text not null default 'NONE' check (boundary_lock in ('NONE', 'UNSURE_CAP', 'NO_LOCK')),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.game_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  option_id text not null,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_game_answers_user on public.game_answers(user_id);

create table if not exists public.mood_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  couple_id uuid references public.couples(id) on delete set null,
  score integer not null check (score between 0 and 100),
  computed_state text not null check (computed_state in ('ANTI_LIBER', 'CASI_LIBER', 'LIBER')),
  final_state text not null check (final_state in ('ANTI_LIBER', 'CASI_LIBER', 'LIBER')),
  manual_override boolean not null default false,
  boundary_lock text not null default 'NONE' check (boundary_lock in ('NONE', 'UNSURE_CAP', 'NO_LOCK')),
  share_mood_state boolean not null default true,
  share_affection_prefs boolean not null default true,
  share_energy_level boolean not null default false,
  affection_prefs text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_mood_checkins_user_date on public.mood_checkins(user_id, created_at desc);

create table if not exists public.shared_results (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  checkin_id uuid not null references public.mood_checkins(id) on delete cascade,
  shared_state text not null check (shared_state in ('ANTI_LIBER', 'CASI_LIBER', 'LIBER')),
  shared_affection_prefs text[] not null default '{}',
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.game_sessions enable row level security;
alter table public.game_answers enable row level security;
alter table public.mood_checkins enable row level security;
alter table public.shared_results enable row level security;

create policy "game_sessions_own_all" on public.game_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Private answers are NEVER accessible to partners or admins
create policy "game_answers_own_all" on public.game_answers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "mood_checkins_own_all" on public.mood_checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "shared_results_own_manage" on public.shared_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "shared_results_partner_read" on public.shared_results
  for select using (
    revoked = false
    and exists (
      select 1 from public.couple_members cm
      where cm.couple_id = shared_results.couple_id and cm.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- 6. COMMERCIAL SAAS: PLANS, SUBSCRIPTIONS, PAYMENTS (MERCADO PAGO BR/UY)
-- ----------------------------------------------------------------------------
create table if not exists public.plans (
  id text primary key,
  code text unique not null check (code in ('FREE', 'PREMIUM', 'PLUS')),
  name_es text not null,
  name_pt text not null,
  description_es text not null,
  description_pt text not null,
  price_brl_cents integer not null default 0,
  price_uyu_cents integer not null default 0,
  benefits_es text[] not null default '{}',
  benefits_pt text[] not null default '{}',
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_code text not null references public.plans(code),
  provider text not null default 'mercadopago' check (provider in ('mercadopago', 'stripe', 'manual')),
  country_code text not null default 'UY' check (country_code in ('BR', 'UY')),
  provider_subscription_id text,
  status text not null default 'inactive' check (status in ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null default 'mercadopago',
  country_code text not null check (country_code in ('BR', 'UY')),
  currency text not null check (currency in ('BRL', 'UYU')),
  amount_cents integer not null check (amount_cents >= 0),
  provider_payment_id text unique,
  status text not null check (status in ('pending', 'approved', 'rejected', 'refunded')),
  raw_event_summary jsonb,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

create policy "plans_public_read" on public.plans for select using (is_active = true or public.is_admin());
create policy "plans_admin_write" on public.plans for all using (public.is_admin()) with check (public.is_admin());

create policy "subscriptions_own_read" on public.subscriptions for select using (auth.uid() = user_id or public.is_admin());
create policy "payments_own_read" on public.payments for select using (auth.uid() = user_id or public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. FEATURE FLAGS & PRIVACY-SAFE AUDIT EVENTS
-- ----------------------------------------------------------------------------
create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  description text,
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.feature_flags enable row level security;
alter table public.audit_events enable row level security;

create policy "feature_flags_public_read" on public.feature_flags for select using (true);
create policy "feature_flags_admin_write" on public.feature_flags for all using (public.is_admin()) with check (public.is_admin());

create policy "audit_events_admin_read" on public.audit_events for select using (public.is_admin());
create policy "audit_events_insert_auth" on public.audit_events for insert with check (auth.uid() = actor_id or public.is_admin());
