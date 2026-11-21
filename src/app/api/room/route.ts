import { NextRequest, NextResponse } from 'next/server';
import type { AffectionMessage, MoodCheckin } from '@/types/liber';

interface RoomPartnerSlot {
  slotId: string;
  displayName: string;
  avatar: string;
  checkin: MoodCheckin | null;
  updatedAt: number;
}

interface RoomState {
  code: string;
  partners: Record<string, RoomPartnerSlot>;
  messages: AffectionMessage[];
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

  if (!code) {
    return NextResponse.json({ ok: false, error: 'Missing room code' }, { status: 400 });
  }

  const room = getOrCreateRoom(code);
  const otherPartner = Object.values(room.partners).find((p) => p.slotId !== mySlotId) ?? null;

  return NextResponse.json({
    ok: true,
    code: room.code,
    partner: otherPartner
      ? {
          displayName: otherPartner.displayName,
          avatar: otherPartner.avatar,
          checkin:
            otherPartner.checkin && otherPartner.checkin.shareMoodState
              ? {
                  ...otherPartner.checkin,
                  affectionPrefs: otherPartner.checkin.shareAffectionPrefs
                    ? otherPartner.checkin.affectionPrefs
                    : [],
                }
              : null,
        }
      : null,
    messages: room.messages.slice(0, 30),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      code?: string;
      slotId?: string;
      displayName?: string;
      avatar?: string;
      checkin?: MoodCheckin | null;
      message?: { emoji: string; text: string };
    };

    if (!body.code || !body.slotId) {
      return NextResponse.json({ ok: false, error: 'Missing code or slotId' }, { status: 400 });
    }

    const room = getOrCreateRoom(body.code);

    if (body.checkin !== undefined) {
      room.partners[body.slotId] = {
        slotId: body.slotId,
        displayName: body.displayName ?? 'Pareja',
        avatar: body.avatar ?? '💖',
        checkin: body.checkin,
        updatedAt: Date.now(),
      };
    }

    if (body.message?.text) {
      room.messages.unshift({
        id: `rm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        senderName: body.displayName ?? 'Pareja',
        emoji: body.message.emoji || '💖',
        text: body.message.text.slice(0, 240),
        createdAt: new Date().toISOString(),
        isFromMe: false,
      });
      room.messages = room.messages.slice(0, 30);
    }

    return NextResponse.json({ ok: true, code: room.code });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
