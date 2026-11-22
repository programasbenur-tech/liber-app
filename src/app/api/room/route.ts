import { NextRequest, NextResponse } from 'next/server';
import {
  computePartnerPresence,
  sanitizeSharedCheckin,
  selectMostRecentPartner,
} from '@/lib/roomPresence';
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';
import type { AffectionMessage, MoodCheckin } from '@/types/liber';

interface RoomPartnerSlot {
  slotId: string;
  displayName: string;
  avatar: string;
  chatEnabled: boolean;
  checkin: MoodCheckin | null;
  lastSeenAt: number;
}

interface RoomState {
  code: string;
  partners: Record<string, RoomPartnerSlot>;
  messages: AffectionMessage[];
}

interface SupabaseRoomMemberRow {
  room_code: string;
  slot_id: string;
  display_name: string;
  avatar: string;
  chat_enabled: boolean;
  checkin: MoodCheckin | null;
  last_seen_at: string;
}

interface SupabaseRoomMessageRow {
  id: string;
  room_code: string;
  sender_slot_id: string;
  sender_name: string;
  emoji: string;
  text: string;
  created_at: string;
}

// In-memory store for instant local-network / single-instance play without Supabase
const globalRooms = globalThis as unknown as {
  __liberRooms?: Map<string, RoomState>;
};
if (!globalRooms.__liberRooms) {
  globalRooms.__liberRooms = new Map<string, RoomState>();
}
const rooms = globalRooms.__liberRooms;

function getOrCreateRoom(code: string): RoomState {
  const normalized = code.trim().toUpperCase();
  let room = rooms.get(normalized);
  if (!room) {
    room = { code: normalized, partners: {}, messages: [] };
    rooms.set(normalized, room);
  }
  return room;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const mySlotId = searchParams.get('slotId') ?? '';
  const callerName = searchParams.get('name');
  const callerAvatar = searchParams.get('avatar');
  const callerChatParam = searchParams.get('chatEnabled');

  if (!code) {
    return NextResponse.json({ ok: false, error: 'Missing room code' }, { status: 400 });
  }

  const normalized = code.trim().toUpperCase();
  const now = Date.now();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data: memberRows, error: membersErr } = await supabase
        .from('live_room_members')
        .select('*')
        .eq('room_code', normalized)
        .order('last_seen_at', { ascending: false });

      if (!membersErr && memberRows) {
        const rows = memberRows as SupabaseRoomMemberRow[];
        const existingMe = mySlotId ? rows.find((r) => r.slot_id === mySlotId) : undefined;
        let participantsCount = rows.length;

        if (mySlotId) {
          const nextChatEnabled =
            callerChatParam === 'false'
              ? false
              : callerChatParam === 'true'
              ? true
              : existingMe?.chat_enabled ?? true;

          const { error: upsertErr } = await supabase.from('live_room_members').upsert(
            {
              room_code: normalized,
              slot_id: mySlotId,
              display_name: callerName?.trim() || existingMe?.display_name || 'Pareja',
              avatar: callerAvatar || existingMe?.avatar || '💖',
              chat_enabled: nextChatEnabled,
              checkin: existingMe?.checkin ?? null,
              last_seen_at: new Date(now).toISOString(),
            },
            { onConflict: 'room_code,slot_id' }
          );

          if (upsertErr) {
            throw upsertErr;
          }
          if (!existingMe) {
            participantsCount += 1;
          }
        }

        const pickedPartner = selectMostRecentPartner(
          rows.map((r) => ({
            row: r,
            slotId: r.slot_id,
            lastSeenAtMs: Date.parse(r.last_seen_at) || 0,
          })),
          mySlotId
        );
        const otherRow = pickedPartner?.row ?? null;

        const { data: msgRows, error: msgErr } = await supabase
          .from('live_room_messages')
          .select('*')
          .eq('room_code', normalized)
          .order('created_at', { ascending: false })
          .limit(50);

        if (msgErr) {
          throw msgErr;
        }

        const messages: AffectionMessage[] = ((msgRows ?? []) as SupabaseRoomMessageRow[])
          .reverse()
          .map((m) => ({
            id: m.id,
            senderSlotId: m.sender_slot_id,
            senderName: m.sender_name,
            emoji: m.emoji,
            text: m.text,
            createdAt: m.created_at,
            isFromMe: false,
          }));

        const otherLastSeenMs = otherRow ? new Date(otherRow.last_seen_at).getTime() : null;

        return NextResponse.json({
          ok: true,
          storage: 'supabase',
          code: normalized,
          participantsCount,
          partner: otherRow
            ? {
                slotId: otherRow.slot_id,
                displayName: otherRow.display_name,
                avatar: otherRow.avatar,
                status: computePartnerPresence(otherLastSeenMs, now),
                lastSeenAt: otherLastSeenMs,
                chatEnabled: otherRow.chat_enabled,
                checkin: sanitizeSharedCheckin(otherRow.checkin),
              }
            : null,
          messages,
        });
      }
    } catch {
      // Fall through safely to in-memory room store if Supabase tables are not ready
    }
  }

  const room = getOrCreateRoom(normalized);

  if (mySlotId) {
    const existing = room.partners[mySlotId];
    room.partners[mySlotId] = {
      slotId: mySlotId,
      displayName: callerName?.trim() || existing?.displayName || 'Pareja',
      avatar: callerAvatar || existing?.avatar || '💖',
      chatEnabled:
        callerChatParam === 'false'
          ? false
          : callerChatParam === 'true'
          ? true
          : existing?.chatEnabled ?? true,
      checkin: existing?.checkin ?? null,
      lastSeenAt: now,
    };
  }

  const pickedMem = selectMostRecentPartner(
    Object.values(room.partners).map((p) => ({
      partner: p,
      slotId: p.slotId,
      lastSeenAtMs: p.lastSeenAt,
    })),
    mySlotId
  );
  const otherPartner = pickedMem?.partner ?? null;

  return NextResponse.json({
    ok: true,
    storage: 'memory',
    supabaseWarning: Boolean(supabase),
    code: room.code,
    participantsCount: Object.keys(room.partners).length,
    partner: otherPartner
      ? {
          slotId: otherPartner.slotId,
          displayName: otherPartner.displayName,
          avatar: otherPartner.avatar,
          status: computePartnerPresence(otherPartner.lastSeenAt, now),
          lastSeenAt: otherPartner.lastSeenAt,
          chatEnabled: otherPartner.chatEnabled,
          checkin: sanitizeSharedCheckin(otherPartner.checkin),
        }
      : null,
    messages: room.messages.slice(-50),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      code?: string;
      slotId?: string;
      displayName?: string;
      avatar?: string;
      chatEnabled?: boolean;
      checkin?: MoodCheckin | null;
      message?: { emoji: string; text: string };
    };

    if (!body.code || !body.slotId) {
      return NextResponse.json({ ok: false, error: 'Missing code or slotId' }, { status: 400 });
    }

    const normalized = body.code.trim().toUpperCase();
    const now = Date.now();
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      try {
        const { data: existingRow, error: fetchErr } = await supabase
          .from('live_room_members')
          .select('*')
          .eq('room_code', normalized)
          .eq('slot_id', body.slotId)
          .maybeSingle();

        if (!fetchErr) {
          const existing = existingRow as SupabaseRoomMemberRow | null;
          const resolvedName = body.displayName?.trim() || existing?.display_name || 'Pareja';
          const resolvedAvatar = body.avatar || existing?.avatar || '💖';
          const resolvedChat =
            typeof body.chatEnabled === 'boolean'
              ? body.chatEnabled
              : existing?.chat_enabled ?? true;
          const resolvedCheckin =
            body.checkin !== undefined ? body.checkin : existing?.checkin ?? null;

          const { error: upsertErr } = await supabase.from('live_room_members').upsert(
            {
              room_code: normalized,
              slot_id: body.slotId,
              display_name: resolvedName,
              avatar: resolvedAvatar,
              chat_enabled: resolvedChat,
              checkin: resolvedCheckin,
              last_seen_at: new Date(now).toISOString(),
            },
            { onConflict: 'room_code,slot_id' }
          );

          if (upsertErr) throw upsertErr;

          if (body.message?.text) {
            const { error: msgInsertErr } = await supabase.from('live_room_messages').insert({
              room_code: normalized,
              sender_slot_id: body.slotId,
              sender_name: resolvedName,
              emoji: body.message.emoji || '💖',
              text: body.message.text.slice(0, 300),
            });
            if (msgInsertErr) throw msgInsertErr;
          }

          return NextResponse.json({
            ok: true,
            storage: 'supabase',
            code: normalized,
          });
        }
      } catch {
        // Fall through safely to in-memory room store if Supabase tables are not ready
      }
    }

    const room = getOrCreateRoom(normalized);
    const existing = room.partners[body.slotId];

    room.partners[body.slotId] = {
      slotId: body.slotId,
      displayName: body.displayName?.trim() || existing?.displayName || 'Pareja',
      avatar: body.avatar || existing?.avatar || '💖',
      chatEnabled:
        typeof body.chatEnabled === 'boolean'
          ? body.chatEnabled
          : existing?.chatEnabled ?? true,
      checkin: body.checkin !== undefined ? body.checkin : existing?.checkin ?? null,
      lastSeenAt: now,
    };

    if (body.message?.text) {
      room.messages.push({
        id: `rm_${now}_${Math.random().toString(36).slice(2, 6)}`,
        senderSlotId: body.slotId,
        senderName: body.displayName?.trim() || existing?.displayName || 'Pareja',
        emoji: body.message.emoji || '💖',
        text: body.message.text.slice(0, 300),
        createdAt: new Date(now).toISOString(),
        isFromMe: false,
      });
      if (room.messages.length > 50) {
        room.messages = room.messages.slice(-50);
      }
    }

    return NextResponse.json({
      ok: true,
      storage: 'memory',
      supabaseWarning: Boolean(supabase),
      code: room.code,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
