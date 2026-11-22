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
