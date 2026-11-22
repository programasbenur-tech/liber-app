import { NextRequest, NextResponse } from 'next/server';
import {
  evaluateDailyUnlock,
  type DailyAnswerEntry,
} from '@/lib/dailyPromptLogic';
import { getSupabaseAdminClient } from '@/lib/supabaseAdmin';

interface SupabaseDailyRow {
  room_code: string;
  prompt_date: string;
  slot_id: string;
  sender_name: string;
  answer_text: string;
  created_at: string;
}

// In-memory store fallback when Supabase is not configured or migration 004 is pending
const globalDaily = globalThis as unknown as {
  __liberDailyAnswers?: Map<string, Record<string, DailyAnswerEntry>>;
};
if (!globalDaily.__liberDailyAnswers) {
  globalDaily.__liberDailyAnswers = new Map<string, Record<string, DailyAnswerEntry>>();
}
const memoryDaily = globalDaily.__liberDailyAnswers;

function makeKey(roomCode: string, dateKey: string): string {
  return `${roomCode.trim().toUpperCase()}__${dateKey.trim()}`;
}

function defaultDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const slotId = searchParams.get('slotId') ?? '';
  const dateKey = searchParams.get('date') || defaultDateKey();

  if (!code) {
    return NextResponse.json({ ok: false, error: 'Missing room code' }, { status: 400 });
  }

  const normalized = code.trim().toUpperCase();
  const supabase = getSupabaseAdminClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('live_room_daily_answers')
        .select('*')
        .eq('room_code', normalized)
        .eq('prompt_date', dateKey)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const rows = data as SupabaseDailyRow[];
        const myRow = slotId ? rows.find((r) => r.slot_id === slotId) : undefined;
        const partnerRow = rows.find((r) => r.slot_id !== slotId);

        const evaluation = evaluateDailyUnlock({
          myAnswer: myRow
            ? {
                slotId: myRow.slot_id,
                senderName: myRow.sender_name,
                answerText: myRow.answer_text,
                createdAt: myRow.created_at,
              }
            : null,
          partnerAnswer: partnerRow
            ? {
                slotId: partnerRow.slot_id,
                senderName: partnerRow.sender_name,
                answerText: partnerRow.answer_text,
                createdAt: partnerRow.created_at,
              }
            : null,
        });

        return NextResponse.json({
          ok: true,
          storage: 'supabase',
          code: normalized,
          date: dateKey,
          ...evaluation,
        });
      }
    } catch {
      // Fall back cleanly to memory store
    }
  }

  const roomAnswers = memoryDaily.get(makeKey(normalized, dateKey)) ?? {};
  const myAnswer = slotId && roomAnswers[slotId] ? roomAnswers[slotId] : null;
  const partnerAnswer =
    Object.values(roomAnswers).find((entry) => entry.slotId !== slotId) ?? null;

  const evaluation = evaluateDailyUnlock({ myAnswer, partnerAnswer });

  return NextResponse.json({
    ok: true,
    storage: 'memory',
    code: normalized,
    date: dateKey,
    ...evaluation,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      code?: string;
      slotId?: string;
      date?: string;
      senderName?: string;
      answerText?: string;
    };

    const trimmedAnswer = body.answerText?.trim() ?? '';
    if (!body.code || !body.slotId || !trimmedAnswer) {
      return NextResponse.json(
        { ok: false, error: 'Missing code, slotId, or answerText' },
        { status: 400 }
      );
    }

    const normalized = body.code.trim().toUpperCase();
    const dateKey = (body.date || defaultDateKey()).trim();
    const senderName = body.senderName?.trim() || 'Pareja';
    const cleanText = trimmedAnswer.slice(0, 300);
    const nowIso = new Date().toISOString();

    const supabase = getSupabaseAdminClient();

    if (supabase) {
      try {
        const { error: upsertErr } = await supabase.from('live_room_daily_answers').upsert(
          {
            room_code: normalized,
            prompt_date: dateKey,
            slot_id: body.slotId,
            sender_name: senderName,
            answer_text: cleanText,
          },
          { onConflict: 'room_code,prompt_date,slot_id' }
        );

        if (!upsertErr) {
          const { data, error: fetchErr } = await supabase
            .from('live_room_daily_answers')
            .select('*')
            .eq('room_code', normalized)
            .eq('prompt_date', dateKey)
            .order('created_at', { ascending: false });

          if (!fetchErr && data) {
            const rows = data as SupabaseDailyRow[];
            const myRow = rows.find((r) => r.slot_id === body.slotId);
            const partnerRow = rows.find((r) => r.slot_id !== body.slotId);

            const evaluation = evaluateDailyUnlock({
              myAnswer: myRow
                ? {
                    slotId: myRow.slot_id,
                    senderName: myRow.sender_name,
                    answerText: myRow.answer_text,
                    createdAt: myRow.created_at,
                  }
                : null,
              partnerAnswer: partnerRow
                ? {
                    slotId: partnerRow.slot_id,
                    senderName: partnerRow.sender_name,
                    answerText: partnerRow.answer_text,
                    createdAt: partnerRow.created_at,
                  }
                : null,
            });

            return NextResponse.json({
              ok: true,
              storage: 'supabase',
              code: normalized,
              date: dateKey,
              ...evaluation,
            });
          }
        }
      } catch {
        // Fall back cleanly to memory store
      }
    }

    const key = makeKey(normalized, dateKey);
    const roomAnswers = memoryDaily.get(key) ?? {};
    roomAnswers[body.slotId] = {
      slotId: body.slotId,
      senderName,
      answerText: cleanText,
      createdAt: nowIso,
    };
    memoryDaily.set(key, roomAnswers);

    const myAnswer = roomAnswers[body.slotId];
    const partnerAnswer =
      Object.values(roomAnswers).find((entry) => entry.slotId !== body.slotId) ?? null;

    const evaluation = evaluateDailyUnlock({ myAnswer, partnerAnswer });

    return NextResponse.json({
      ok: true,
      storage: 'memory',
      code: normalized,
      date: dateKey,
      ...evaluation,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }
}
