-- ============================================================================
-- LIBER ❤️ — Migration 005: Shared Couple Flame ("Nuestra Llama" Zero-Guilt)
-- ============================================================================

create table if not exists public.live_room_flame_events (
  id uuid primary key default gen_random_uuid(),
  room_code text not null,
  slot_id text not null,
  sender_name text not null default 'Pareja',
  action_type text not null check (
    action_type in ('spark', 'repair', 'daily_key', 'anti_stress', 'affection')
  ),
  points int not null default 1 check (points between 1 and 5),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_live_room_flame_room_created
  on public.live_room_flame_events(room_code, created_at desc);

-- Enable Row Level Security with no public anon policies:
-- All reads/writes go through the server API (/api/flame) using service role key.
alter table public.live_room_flame_events enable row level security;
