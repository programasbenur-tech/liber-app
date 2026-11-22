export interface DailyAnswerEntry {
  slotId: string;
  senderName: string;
  answerText: string;
  createdAt: string;
}

export type DailyUnlockStatus =
  | 'neither_answered'
  | 'waiting_for_partner'
  | 'waiting_for_me'
  | 'unlocked';

export interface DailyUnlockResult {
  status: DailyUnlockStatus;
  myAnswer: DailyAnswerEntry | null;
  partnerAnswered: boolean;
  partnerName: string | null;
  visiblePartnerAnswer: string | null;
}

/**
 * Enforces BeReal-style Double-Key reveal:
 * Partner's answer text stays strictly hidden (`null`) until BOTH partners answer.
 */
export function evaluateDailyUnlock(params: {
  myAnswer: DailyAnswerEntry | null;
  partnerAnswer: DailyAnswerEntry | null;
}): DailyUnlockResult {
  const { myAnswer, partnerAnswer } = params;

  if (myAnswer && partnerAnswer) {
    return {
      status: 'unlocked',
      myAnswer,
      partnerAnswered: true,
      partnerName: partnerAnswer.senderName,
      visiblePartnerAnswer: partnerAnswer.answerText,
    };
  }

  if (myAnswer && !partnerAnswer) {
    return {
      status: 'waiting_for_partner',
      myAnswer,
      partnerAnswered: false,
      partnerName: null,
      visiblePartnerAnswer: null,
    };
  }

  if (!myAnswer && partnerAnswer) {
    return {
      status: 'waiting_for_me',
      myAnswer: null,
      partnerAnswered: true,
      partnerName: partnerAnswer.senderName,
      visiblePartnerAnswer: null,
    };
  }

  return {
    status: 'neither_answered',
    myAnswer: null,
    partnerAnswered: false,
    partnerName: null,
    visiblePartnerAnswer: null,
  };
}
