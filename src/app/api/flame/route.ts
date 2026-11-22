import { NextRequest, NextResponse } from 'next/server';
import {
  FLAME_ACTION_POINTS,
  computeFlameSummary,
  isValidFlameAction,
  type FlameEvent,
} from '@/lib/flameLogic';
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';

interface SupabaseFlameRow {
  id: string;
  room_code: string;
  slot_id: string;
  sender_name: string;
  action_type: string;
  points: number;
  note: string | null;
  created_at: string;
}

const globalFlame = globalThis as unknown as {
  __liberFlameEvents?: Map<string, FlameEvent[]>;
};
if (!globalFlame.__liberFlameEvents) {
  globalFlame.__liberFlameEvents = new Map<string, FlameEvent[]>();
}
const memoryFlame = globalFlame.__liberFlameEvents;

function mapRowToEvent(row: SupabaseFlameRow): FlameEvent {
  return {
    id: row.id,
    slotId: row.slot_id,
    senderName: row.sender_name,
    actionType: isValidFlameAction(row.action_type) ? row.action_type : 'spark',
    points: Number.isFinite(row.points) ? row.points : 1,
    note: row.note,
    createdAt: row.created_at,
  };
}

function makeEventId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `flm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ ok: false, error: 'Missing room code' }, { status: 400 });
  }

  const normalized = code.trim().toUpperCase();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('live_room_flame_events')
        .select('*')
        .eq('room_code', normalized)
        .order('created_at', { ascending: false })
        .limit(200);

      if (!error && data) {
        const events = (data as SupabaseFlameRow[]).map(mapRowToEvent);
        return NextResponse.json({
          ok: true,
          storage: 'supabase',
          code: normalized,
          summary: computeFlameSummary(events),
        });
      }
    } catch {
      // Fall back safely to in-memory room store
    }
  }

  const events = memoryFlame.get(normalized) ?? [];
  return NextResponse.json({
    ok: true,
    storage: 'memory',
    code: normalized,
    summary: computeFlameSummary(events),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      code?: string;
      slotId?: string;
      senderName?: string;
      actionType?: string;
      note?: string;
    };

    if (!body.code || !body.slotId || !isValidFlameAction(body.actionType)) {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid code, slotId, or actionType' },
        { status: 400 }
      );
    }

    const normalized = body.code.trim().toUpperCase();
    const senderName = body.senderName?.trim() || 'Pareja';
    const points = FLAME_ACTION_POINTS[body.actionType];
    const cleanNote = body.note?.trim().slice(0, 160) || null;
    const supabase = getSupabaseAdminClient();

    if (supabase) {
      try {
        const { error: insertErr } = await supabase.from('live_room_flame_events').insert({
          room_code: normalized,
          slot_id: body.slotId,
          sender_name: senderName,
          action_type: body.actionType,
          points,
          note: cleanNote,
        });

        if (!insertErr) {
          const { data, error: fetchErr } = await supabase
            .from('live_room_flame_events')
            .select('*')
            .eq('room_code', normalized)
            .order('created_at', { ascending: false })
            .limit(200);

          if (!fetchErr && data) {
            const events = (data as SupabaseFlameRow[]).map(mapRowToEvent);
            return NextResponse.json({
              ok: true,
              storage: 'supabase',
              code: normalized,
              summary: computeFlameSummary(events),
            });
          }
        }
      } catch {
        // Fall back safely to in-memory room store
      }
    }

    const existing = memoryFlame.get(normalized) ?? [];
    const created: FlameEvent = {
      id: makeEventId(),
      slotId: body.slotId,
      senderName,
      actionType: body.actionType,
      points,
      note: cleanNote,
      createdAt: new Date().toISOString(),
    };
    const nextEvents = [created, ...existing].slice(0, 200);
    memoryFlame.set(normalized, nextEvents);

    return NextResponse.json({
      ok: true,
      storage: 'memory',
      code: normalized,
      summary: computeFlameSummary(nextEvents),
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
  }
}
