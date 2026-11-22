export type Language = 'es' | 'pt-BR';

export type TrafficState = 'LIBER' | 'CASI_LIBER' | 'ANTI_LIBER';

export type QuestionCategory =
  | 'romantic_mood'
  | 'physical_affection'
  | 'emotional_connection'
  | 'energy_tiredness'
  | 'playful_flirting'
  | 'quality_time'
  | 'intimacy_interest'
  | 'boundaries_preferences';

export type BoundaryLock = 'NONE' | 'UNSURE_CAP' | 'NO_LOCK';

export interface AnswerOption {
  id: string;
  emoji: string;
  label: Record<Language, string>;
  /** Weight from 0 to 100 contributing to the self-reported mood score */
  points: number;
  /** If true, selecting this explicit "No / Not now" locks state to ANTI_LIBER */
  isBoundaryNo?: boolean;
  /** If true, selecting "Unsure / Maybe" caps computed state at CASI_LIBER */
  isUnsure?: boolean;
  /** Optional affection preference tag surfaced only if user shares affection prefs */
  affectionTag?: string;
}

export interface Question {
  id: string;
  category: QuestionCategory;
  prompt: Record<Language, string>;
  options: AnswerOption[];
  isDirectPreference?: boolean;
}

export interface QuizAnswerRecord {
  questionId: string;
  optionId: string;
  points: number;
  isBoundaryNo?: boolean;
  isUnsure?: boolean;
  affectionTag?: string;
}

export interface ScoringResult {
  score: number;
  computedState: TrafficState;
  finalState: TrafficState;
  boundaryLock: BoundaryLock;
  manualOverride: boolean;
  affectionTags: string[];
}

export interface PrivacySettings {
  shareMoodState: boolean;
  shareAffectionPrefs: boolean;
  shareEnergyLevel: boolean;
  historyOptInSelf: boolean;
  historyOptInPartner: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatarEmoji: string;
  language: Language;
  isAdultConfirmed: boolean;
  soundEnabled: boolean;
}

export interface MoodCheckin {
  id: string;
  userId: string;
  score: number;
  computedState: TrafficState;
  finalState: TrafficState;
  manualOverride: boolean;
  boundaryLock: BoundaryLock;
  shareMoodState: boolean;
  shareAffectionPrefs: boolean;
  shareEnergyLevel: boolean;
  affectionPrefs: string[];
  energyNote?: string;
  customNote?: string;
  createdAt: string;
}

export type PartnerPresenceStatus = 'waiting' | 'online' | 'recent' | 'simulated';

export interface AffectionMessage {
  id: string;
  senderSlotId?: string;
  senderName: string;
  emoji: string;
  text: string;
  createdAt: string;
  isFromMe: boolean;
}

export interface CoupleState {
  coupleId: string;
  inviteCode: string;
  partnerLinked: boolean;
  partnerName: string;
  partnerAvatar: string;
  partnerLatestCheckin: MoodCheckin | null;
  myDisplayName?: string;
  myAvatar?: string;
  myChatEnabled?: boolean;
  partnerChatEnabled?: boolean;
  partnerStatus?: PartnerPresenceStatus;
  partnerLastSeenAt?: number | null;
  isSimulatedPartner?: boolean;
}

export interface RomanticIdea {
  id: string;
  type: 'surprise' | 'date' | 'nonsexual_bonding';
  emoji: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
}

export type MysteryFacet = 'atmosphere' | 'chemistry' | 'rhythm' | 'secret_clue';

export interface MysteryQuestion {
  id: string;
  facet: MysteryFacet;
  prompt: Record<Language, string>;
  options: AnswerOption[];
}

export type TrustDimension =
  | 'walls_windows'
  | 'investment_commitment'
  | 'attunement_repair'
  | 'clear_agreements';

export type TrustProfileCode = 'FORTALEZA' | 'ATENCION' | 'ALERTA_CONVERSACION';

export interface TrustOption {
  id: string;
  emoji: string;
  label: Record<Language, string>;
  /** 0–100 protective-habit score (higher = stronger protective trust pattern) */
  points: number;
}

export interface TrustQuestion {
  id: string;
  dimension: TrustDimension;
  frameworkRef: Record<Language, string>;
  prompt: Record<Language, string>;
  options: TrustOption[];
  scientificNote: Record<Language, string>;
}

export interface TrustAnswerRecord {
  questionId: string;
  dimension: TrustDimension;
  optionId: string;
  points: number;
}

export interface TrustDimensionScore {
  dimension: TrustDimension;
  score: number;
  answeredCount: number;
}

export interface TrustLabResult {
  overallScore: number;
  profile: TrustProfileCode;
  dimensions: TrustDimensionScore[];
  strongestDimension: TrustDimension;
  focusDimension: TrustDimension;
  completedAt: string;
}
