-- ============================================================================
-- LIBER ❤️ — Migration 004: Daily Double-Key Prompts (BeReal-style Unlock)
-- ============================================================================

create table if not exists public.live_room_daily_answers (
  room_code text not null,
  prompt_date text not null,
  slot_id text not null,
  sender_name text not null default 'Pareja',
  answer_text text not null check (char_length(answer_text) between 1 and 300),
  created_at timestamptz not null default now(),
  primary key (room_code, prompt_date, slot_id)
);

create index if not exists idx_live_room_daily_room_date
  on public.live_room_daily_answers(room_code, prompt_date);

-- Enable Row Level Security with no public anon policies:
-- Partner answers remain strictly hidden until BOTH partners submit via /api/daily.
alter table public.live_room_daily_answers enable row level security;
