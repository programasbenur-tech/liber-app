-- ============================================================================
-- LIBER ❤️ — El Semáforo del Amor
-- Supabase PostgreSQL Schema & Row-Level Security (RLS) Policies
-- ============================================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES (18+ Adult Users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  avatar_emoji text not null default '💖',
  language text not null default 'es' check (language in ('es', 'pt-BR')),
  is_adult_confirmed boolean not null default false,
  sound_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 2. COUPLES (Secure Invite-Code Linking)
-- ----------------------------------------------------------------------------
create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  partner_a_id uuid not null references public.profiles(id) on delete cascade,
  partner_b_id uuid references public.profiles(id) on delete set null,
  invite_code text unique not null check (char_length(invite_code) between 6 and 12),
  history_opt_in_a boolean not null default false,
  history_opt_in_b boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.couples enable row level security;

create policy "Partners can view their own couple record"
  on public.couples for select
  using (auth.uid() = partner_a_id or auth.uid() = partner_b_id);

create policy "Authenticated users can create a couple invite"
  on public.couples for insert
  with check (auth.uid() = partner_a_id);

create policy "Partners can update couple settings or join via invite"
  on public.couples for update
  using (
    auth.uid() = partner_a_id
    or auth.uid() = partner_b_id
    or (partner_b_id is null)
  );

create policy "Partners can delete couple link"
  on public.couples for delete
  using (auth.uid() = partner_a_id or auth.uid() = partner_b_id);

-- Allow linked partners to view each other's public display_name & avatar_emoji
create policy "Linked partner can view partner basic profile"
  on public.profiles for select
  using (
    exists (
      select 1 from public.couples c
      where (c.partner_a_id = auth.uid() and c.partner_b_id = profiles.id)
         or (c.partner_b_id = auth.uid() and c.partner_a_id = profiles.id)
    )
  );

-- ----------------------------------------------------------------------------
-- 3. MOOD CHECK-INS (Voluntary Sharing Controls)
-- ----------------------------------------------------------------------------
create table if not exists public.mood_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  couple_id uuid references public.couples(id) on delete set null,
  score integer not null check (score between 0 and 100),
  computed_state text not null check (computed_state in ('ANTI_LIBER', 'CASI_LIBER', 'LIBER')),
  final_state text not null check (final_state in ('ANTI_LIBER', 'CASI_LIBER', 'LIBER')),
  manual_override boolean not null default false,
  explicit_boundary_lock text not null default 'NONE' check (explicit_boundary_lock in ('NONE', 'UNSURE_CAP', 'NO_LOCK')),
  -- Granular privacy permissions
  share_mood_state boolean not null default true,
  share_affection_prefs boolean not null default true,
  share_energy_level boolean not null default false,
  affection_preferences text[] not null default '{}',
  energy_note text,
  custom_note text,
  created_at timestamptz not null default now()
);

alter table public.mood_checkins enable row level security;

create policy "Users can view all their own check-ins"
  on public.mood_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert their own check-ins"
  on public.mood_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own check-ins"
  on public.mood_checkins for update
  using (auth.uid() = user_id);

create policy "Users can delete their own check-ins"
  on public.mood_checkins for delete
  using (auth.uid() = user_id);

-- Partner can ONLY read check-ins that are explicitly shared.
-- Historical check-ins (older than latest) require mutual history opt-in.
create policy "Partner can view explicitly shared latest check-in"
  on public.mood_checkins for select
  using (
    share_mood_state = true
    and exists (
      select 1 from public.couples c
      where c.id = mood_checkins.couple_id
        and (
          (c.partner_a_id = auth.uid() and c.partner_b_id = mood_checkins.user_id)
          or (c.partner_b_id = auth.uid() and c.partner_a_id = mood_checkins.user_id)
        )
        and (
          -- Either both opted into history, OR this is the partner's most recent check-in
          (c.history_opt_in_a = true and c.history_opt_in_b = true)
          or mood_checkins.created_at = (
            select max(m2.created_at)
            from public.mood_checkins m2
            where m2.user_id = mood_checkins.user_id
          )
        )
    )
  );

-- ----------------------------------------------------------------------------
-- 4. QUESTIONNAIRE RESPONSES (Strictly Private by Default)
-- ----------------------------------------------------------------------------
create table if not exists public.questionnaire_responses (
  id uuid primary key default gen_random_uuid(),
  checkin_id uuid references public.mood_checkins(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id text not null,
  answer_id text not null,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.questionnaire_responses enable row level security;

-- Private answers are NEVER exposed to partner via RLS unless explicitly marked non-private
create policy "Users can manage their own questionnaire responses"
  on public.questionnaire_responses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Partner can view only explicitly shared individual answers"
  on public.questionnaire_responses for select
  using (
    is_private = false
    and exists (
      select 1 from public.couples c
      where (c.partner_a_id = auth.uid() and c.partner_b_id = questionnaire_responses.user_id)
         or (c.partner_b_id = auth.uid() and c.partner_a_id = questionnaire_responses.user_id)
    )
  );

-- ----------------------------------------------------------------------------
-- 5. VIRTUAL AFFECTIONATE MESSAGES
-- ----------------------------------------------------------------------------
create table if not exists public.affection_messages (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  message_key text not null,
  custom_text text,
  emoji text not null default '💌',
  created_at timestamptz not null default now()
);

alter table public.affection_messages enable row level security;

create policy "Partners can view messages in their couple"
  on public.affection_messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Partners can send messages in their couple"
  on public.affection_messages for insert
  with check (auth.uid() = sender_id);

create policy "Users can delete their sent or received messages"
  on public.affection_messages for delete
  using (auth.uid() = sender_id or auth.uid() = receiver_id);
