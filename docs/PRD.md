# LIBER ❤️ — Product Requirements Document (PRD)

## 1. Vision & Product Concept
**LIBER ❤️ — El Semáforo del Amor** (*O Semáforo do Amor* in Brazilian Portuguese) is a humorous, romantic, respectful 18+ web/PWA application that helps adult couples communicate their current mood, affection preferences, energy levels, and openness to intimacy without pressure, awkwardness, or fear of rejection.

### The Three Traffic Light States
- **🟢 LIBER (`"¡Estoy Liber!"` / `"Estou Liber!"`):** Feeling romantically interested and potentially open to intimacy.
- **🟡 CASI LIBER (`"¡Estoy Casi Liber!"` / `"Estou Quase Liber!"`):** Might be interested, depending on mood, context, affection, and what both partners want.
- **🔴 ANTI LIBER (`"¡Estoy Anti Liber!"` / `"Estou Anti Liber!"`):** Not interested in intimacy right now, though affection, cuddles, and companionship may still be welcome.

---

## 2. Target Audience & Personas
- Adult couples (18+) in Spanish-speaking and Brazilian Portuguese-speaking regions.
- Long-term couples, cohabiting partners, new couples, and long-distance partners looking for a lighthearted 2-minute daily check-in.

---

## 3. Core Functional Requirements

### 3.1 Age Verification & Onboarding
- Explicit 18+ adult confirmation gate on first launch.
- Language selector: Spanish (`es`, default) and Brazilian Portuguese (`pt-BR`).
- Local Demo Mode out-of-the-box (no backend required to try every feature) + optional Supabase Auth & real-time couple sync.

### 3.2 Couple Profiles & Secure Linking
- Separate accounts/profiles with display name and avatar emoji.
- 8-character invite code generation and joining flow.
- Private questionnaire completion: individual answers are **never** revealed to the partner without explicit permission.

### 3.3 Romantic Question Game (64 Questions, 8 Categories)
- 8 categories (8 original questions each = 64 total, fully localized in `es` and `pt-BR`):
  1. Romantic mood (`romantic_mood`)
  2. Physical affection (`physical_affection`)
  3. Emotional connection (`emotional_connection`)
  4. Energy and tiredness (`energy_tiredness`)
  5. Playful flirting (`playful_flirting`)
  6. Quality time (`quality_time`)
  7. Interest in intimacy (`intimacy_interest`)
  8. Boundaries and preferences (`boundaries_preferences`)
- Supports:
  - **Full/Quick Check-in Session** (curated mix across categories + final direct preference question).
  - **Category Explorer** (play any specific category).
  - **Quiz Roulette** (animated wheel/spinner that picks a random category & question).

### 3.4 Transparent Scoring & Consent Guardrails
- Non-clinical 0–100 score calculated from self-reported answers:
  - `0–39`: `ANTI_LIBER`
  - `40–69`: `CASI_LIBER`
  - `70–100`: `LIBER`
- **Hard Consent Lock:** An explicit "No" or "Not now" on boundary/intimacy questions or the final direct preference question locks the computed state to `ANTI_LIBER`; "I'm unsure" caps the computed state at `CASI_LIBER`. A high score can **never** override an explicit "No", "Not now", or "I'm unsure".
- **Manual Override:** Users can always manually select their final traffic-light state.
- **Anti-Inference Disclaimer:** The app explicitly states that thresholds are playful game mechanics, not scientific predictions, and never infers consent from behavior, clothing, or gestures.

### 3.5 Couple Match Mode
- Compares **only** voluntarily shared states and affection preferences.
- Warm, funny, non-coercive compatibility messages for all 6 state pairs.
- Never frames a mismatch as rejection, failure, or obligation; never nudges a partner to change their answer.

### 3.6 Entertainment & Bonding Features
- Animated traffic light & floating hearts.
- **Daily Mood Check-in** (fast 1-tap or mini-quiz).
- **SORPRÉNDEME** button generating wholesome romantic ideas, non-sexual bonding activities, and date suggestions.
- **Virtual Affectionate Messages** (zero-pressure sweet notes).
- **Optional Playful Sound Effects** (Web Audio API chimes with mute toggle).
- **Private Couple History** (visible only when **both** partners mutually opt in).

### 3.7 Privacy, Safety & Data Control
- No location tracking, no partner surveillance, no hidden monitoring.
- Granular sharing toggles: share mood state, share affection preferences, share energy level.
- One-click **Delete All My Data** button.
