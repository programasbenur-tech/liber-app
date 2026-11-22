-- ============================================================================
-- LIBER ❤️ — Migration 003: Live Couple Rooms (Presence & Private 2-Way Chat)
-- ============================================================================

create table if not exists public.live_room_members (
  room_code text not null,
  slot_id text not null,
  display_name text not null default 'Pareja',
  avatar text not null default '💖',
  chat_enabled boolean not null default true,
  checkin jsonb,
  last_seen_at timestamptz not null default now(),
  primary key (room_code, slot_id)
);

create index if not exists idx_live_room_members_room_seen
  on public.live_room_members(room_code, last_seen_at desc);

create table if not exists public.live_room_messages (
  id uuid primary key default gen_random_uuid(),
  room_code text not null,
  sender_slot_id text not null,
  sender_name text not null,
  emoji text not null default '💖',
  text text not null check (char_length(text) <= 300),
  created_at timestamptz not null default now()
);

create index if not exists idx_live_room_messages_room_created
  on public.live_room_messages(room_code, created_at desc);

-- Enable Row Level Security with no public anon policies:
-- All room reads/writes are validated and sanitized server-side via /api/room.
alter table public.live_room_members enable row level security;
alter table public.live_room_messages enable row level security;
