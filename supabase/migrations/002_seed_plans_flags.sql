-- ============================================================================
-- LIBER ❤️ — Migration 002: Seed Subscription Plans (BR/UY) & Feature Flags
-- ============================================================================

insert into public.plans (
  id, code, name_es, name_pt, description_es, description_pt,
  price_brl_cents, price_uyu_cents, benefits_es, benefits_pt, is_active
) values
(
  'plan_free',
  'FREE',
  'LIBER Gratis',
  'LIBER Grátis',
  'Semáforo diario y juegos esenciales para empezar a conectar.',
  'Semáforo diário e jogos essenciais para começar a conectar.',
  0,
  0,
  array['Semáforo del Amor diario', 'Cuestionario básico', 'Modo Pareja privado', 'Español y Português'],
  array['Semáforo do Amor diário', 'Questionário básico', 'Modo Casal privado', 'Espanhol e Português'],
  true
),
(
  'plan_premium',
  'PREMIUM',
  'LIBER Premium',
  'LIBER Premium',
  'Experiencia completa de 64 preguntas, ruleta, historial y actividades.',
  'Experiência completa de 64 perguntas, roleta, histórico e atividades.',
  1990,
  29000,
  array['64 preguntas bilingües completas', 'Ruleta Romántica ilimitada', 'Historial de pareja con opt-in mutuo', 'Mensajes y sorpresas exclusivas'],
  array['64 perguntas bilíngues completas', 'Roleta Romântica ilimitada', 'Histórico do casal com opt-in mútuo', 'Mensagens e surpresas exclusivas'],
  true
),
(
  'plan_plus',
  'PLUS',
  'LIBER Plus',
  'LIBER Plus',
  'Todo Premium + desafíos exclusivos y competencias futuras.',
  'Tudo do Premium + desafios exclusivos e competições futuras.',
  2990,
  45000,
  array['Todo lo incluido en Premium', 'Desafíos semanales para parejas', 'Personalización avanzada', 'Acceso prioritario a Competencias (cuando se activen)'],
  array['Tudo incluído no Premium', 'Desafios semanais para casais', 'Personalização avançada', 'Acesso prioritário a Competições (quando ativadas)'],
  true
)
on conflict (id) do nothing;

-- Optional Competition Mode MUST be disabled by default
insert into public.feature_flags (key, enabled, description)
values (
  'ENABLE_COUPLE_COMPETITIONS',
  false,
  'Optional friendly couple trivia & challenges module. Disabled by default.'
)
on conflict (key) do nothing;
