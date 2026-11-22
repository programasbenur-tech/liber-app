import type {
  AffectionMessage,
  MoodCheckin,
  PartnerPresenceStatus,
} from '../types/liber.ts';

export const ONLINE_THRESHOLD_MS = 15_000;

export function sanitizeSharedCheckin(
  checkin: MoodCheckin | null | undefined
): MoodCheckin | null {
  if (!checkin || !checkin.shareMoodState) {
    return null;
  }
  return {
    ...checkin,
    affectionPrefs: checkin.shareAffectionPrefs ? checkin.affectionPrefs : [],
  };
}

export function computePartnerPresence(
  lastSeenAt: number | null | undefined,
  nowMs: number = Date.now()
): 'waiting' | 'online' | 'recent' {
  if (lastSeenAt === null || lastSeenAt === undefined) {
    return 'waiting';
  }
  return nowMs - lastSeenAt <= ONLINE_THRESHOLD_MS ? 'online' : 'recent';
}

export function canCoupleChat(params: {
  myChatEnabled: boolean;
  partnerChatEnabled: boolean;
  partnerStatus: PartnerPresenceStatus;
}): boolean {
  if (!params.myChatEnabled) return false;
  if (params.partnerStatus === 'simulated') return true;
  if (params.partnerStatus === 'waiting') return false;
  return params.partnerChatEnabled;
}

export function normalizeRoomMessages(
  messages: AffectionMessage[],
  mySlotId: string
): AffectionMessage[] {
  return [...messages]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((m) => ({
      ...m,
      isFromMe: Boolean(m.senderSlotId && m.senderSlotId === mySlotId),
    }));
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `LIBER-${suffix}`;
}

/**
 * Deterministically picks the most recently active room slot other than `mySlotId`
 * so rooms with stale browser tabs never flip-flop between different partner rows.
 */
export function selectMostRecentPartner<
  T extends { slotId: string; lastSeenAtMs: number }
>(members: T[], mySlotId: string): T | null {
  const candidates = members.filter((m) => m.slotId && m.slotId !== mySlotId);
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => {
    if (b.lastSeenAtMs !== a.lastSeenAtMs) {
      return b.lastSeenAtMs - a.lastSeenAtMs;
    }
    return a.slotId.localeCompare(b.slotId);
  });
  return candidates[0];
}

function checkinSignature(c: MoodCheckin | null | undefined): string {
  if (!c) return 'null';
  return [
    c.id,
    c.finalState,
    c.score,
    c.createdAt,
    c.customNote ?? '',
    String(c.shareMoodState),
    (c.affectionPrefs ?? []).join(','),
  ].join('|');
}

/**
 * Returns true only when partner identity, presence, shared mood, or messages
 * meaningfully changed so polling skips redundant state updates and UI flicker.
 */
export function hasRoomSnapshotChanged(params: {
  prevPartner: {
    linked: boolean;
    name: string;
    avatar: string;
    status?: PartnerPresenceStatus;
    chatEnabled?: boolean;
    checkin: MoodCheckin | null;
  };
  nextPartner: {
    linked: boolean;
    name: string;
    avatar: string;
    status: PartnerPresenceStatus;
    chatEnabled: boolean;
    checkin: MoodCheckin | null;
  };
  prevMessages: AffectionMessage[];
  nextMessages: AffectionMessage[];
}): boolean {
  const { prevPartner, nextPartner, prevMessages, nextMessages } = params;
  if (prevPartner.linked !== nextPartner.linked) return true;
  if (prevPartner.name !== nextPartner.name) return true;
  if (prevPartner.avatar !== nextPartner.avatar) return true;
  if ((prevPartner.status ?? 'waiting') !== nextPartner.status) return true;
  if ((prevPartner.chatEnabled !== false) !== nextPartner.chatEnabled) return true;
  if (checkinSignature(prevPartner.checkin) !== checkinSignature(nextPartner.checkin)) {
    return true;
  }
  if (prevMessages.length !== nextMessages.length) return true;
  if (prevMessages.length > 0) {
    const prevFirst = prevMessages[0];
    const nextFirst = nextMessages[0];
    const prevLast = prevMessages[prevMessages.length - 1];
    const nextLast = nextMessages[nextMessages.length - 1];
    if (
      prevFirst.id !== nextFirst.id ||
      prevLast.id !== nextLast.id ||
      prevLast.isFromMe !== nextLast.isFromMe
    ) {
      return true;
    }
  }
  return false;
}
