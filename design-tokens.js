/**
 * Septembro Amarelo — Design System Tokens
 * 1080×1920 @ 30fps | Grid 8pt + Escala Tipográfica Modular
 * 
 * Uso: importar em qualquer arquivo de renderização para consistência visual
 */

// ═══════════════════════════════════════════════════════════
// PALETA DE CORES
// ═══════════════════════════════════════════════════════════

export const COLORS = {
  yellow: '#FFCF00',        // Amarelo principal — Setembro Amarelo
  yellowDeep: '#E6B800',    // Amarelo mais escuro (cena 04 — mensagem)
  ink: '#1A1A1A',           // Texto primário — quase preto para contraste máximo
  inkSoft: '#6B6B6B',       // Texto secundário — cinza médio
  inkMuted: '#999999',      // Texto terciário — cinza claro
  white: '#FFFFFF',
  whiteSoft: 'rgba(255,255,255,0.30)',  // Fundo de cards
  whiteHighlight: 'rgba(255,255,255,0.15)', // Badge background
};

// ═══════════════════════════════════════════════════════════
// GRID 8-PT
// ═══════════════════════════════════════════════════════════

export const GRID = {
  1: 8,    // 8px — espaçamento mínimo
  2: 16,   // 16px — spacing pequeno
  3: 24,   // 24px — spacing médio
  4: 32,   // 32px — spacing grande
  5: 40,   // 40px
  6: 48,   // 48px
  8: 64,   // 64px — margem padrão (MARGIN_X)
  10: 80,  // 80px
  12: 96,  // 96px
  16: 128, // 128px
  20: 160, // 160px
  24: 192, // 192px
};

export const MARGIN_X = GRID[8];  // 64px laterais
export const CONTENT_W = 1080 - 2 * MARGIN_X; // 960px

// ═══════════════════════════════════════════════════════════
// ESCALA TIPOGRÁFICA MODULAR (ratio 1.25)
// Base: 28px
// 28 → 35 → 44 → 55 → 69 → 86 → 108
// ═══════════════════════════════════════════════════════════

export const TYPOGRAPHY = {
  caption:    { size: 18, weight: 400 },   // Labels, notas pequenas
  small:      { size: 22, weight: 400 },   // Body pequeno, disclaimers
  body:       { size: 28, weight: 400 },   // Texto corpo principal
  subtitle:   { size: 36, weight: 500 },   // Subtítulos, labels de seção
  title:      { size: 48, weight: 600 },   // Títulos de seção
  headline:   { size: 64, weight: 700 },   // Headlines, números grandes
  display:    { size: 96, weight: 800 },   // Título principal, display
};

// Tamanhos específicos para elementos pontuais
export const TYPOGRAPHY_ADHOC = {
  bigNumber: { size: 120, weight: 800 },   // Número grande de destaque
  cardTitle:  { size: 64, weight: 700 },   // Título de card (Ligue 188)
  hashtag:    { size: 42, weight: 500 },   // Hashtag de fechamento
};

// ═══════════════════════════════════════════════════════════
// LETTER-SPACING (para caixa alta)
// ═══════════════════════════════════════════════════════════

export const LETTER_SPACING = {
  display: 4,    // Título principal "SETEMBRO AMARELO"
  headline: 2,   // Headlines "Santa Catarina"
  hashtag: 3,    // Hashtags "#SetembroAmareloSC"
  badge: 1,      // Badges pequenos "+61%"
  none: 0,       // Texto normal (sem espaçamento extra)
};

// ═══════════════════════════════════════════════════════════
// DURAÇÕES DAS CENA (em segundos)
// ═══════════════════════════════════════════════════════════

export const SCENE_DURATIONS = [5, 7, 6, 5, 5, 2]; // Total: 30s

// ═══════════════════════════════════════════════════════════
// TIMING DE ANIMAÇÃO (em segundos, relativo ao início da cena)
// ═══════════════════════════════════════════════════════════

export const TIMING = {
  sceneFadeIn: 0.5,        // Fade de entrada da cena
  sceneFadeOut: 0.4,       // Fade de saída da cena
  titleAppear: [0.3, 2.0], // Título principal: aparece em 0.3s, completo em 2.0s
  subtitleAppear: [1.5, 3.5], // Tagline: aparece em 1.5s, completo em 3.5s
  countUp: [0.8, 3.5],     // Count-up: start e end
  badgeAppear: [1.0, 2.5], // Badge +61%: aparece
  cardBounce: [0.5, 1.5],  // Card CVV: animação de bounce
};

// ═══════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════

export const EASING = {
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeOutQuart: t => 1 - Math.pow(1 - t, 4),
  easeInOutCubic: t => t < 0.5 ? 2 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DO VÍDEO
// ═══════════════════════════════════════════════════════════

export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  duration: 30,
  totalFrames: 30 * 30, // 900
  crf: 18,           // Qualidade do ffmpeg (menor = melhor)
  preset: 'medium',  // Velocidade de codificação
  audioBitrate: '192k',
};

// ═══════════════════════════════════════════════════════════
// FONT STACK
// ═══════════════════════════════════════════════════════════

export const FONT_STACK = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// ═══════════════════════════════════════════════════════════
// POSIÇÕES PADRÃO (em pixels, relativo ao canto superior esquerdo)
// ═══════════════════════════════════════════════════════════

export const LAYOUT = {
  titleY: H => H * 0.18,           // Título principal (cena 01)
  taglineY: H => H * 0.78,         // Tagline (cena 01)
  sectionTitleY: H => G[8],        // Título de seção (cena 02)
  bigNumberY: H => H * 0.35,       // Número grande (cena 02)
  badgeX: W => W - MARGIN_X - GRID[8], // Badge +61% (cena 02)
  badgeY: H => H * 0.35,           // Badge position
  genderColumnY: H => H * 0.25,    // Coluna de gênero (cena 03)
  genderLeftX: W => W * 0.15 + W * 0.5,  // Centro da coluna esquerda
  genderRightX: W => W * 0.85 + W * 0.5, // Centro da coluna direita
  calloutY: H => H * 0.85,         // Callout (cena 03)
  messageY: H => H * 0.15,         // Mensagem (cena 04)
  cityY: H => G[8],                 // Cidade (cena 05)
  cardY: H => H * 0.38,            // Card CVV (cena 05)
  cardWidth: 540,                   // Largura do card CVV
  cardHeight: 200,                  // Altura do card CVV
  ubsY: H => H * 0.65,             // UBS/CAPS (cena 05)
  instY: H => H * 0.74,            // Instituições (cena 05)
  hashtagY: H => H * 0.30,         // Hashtag (cena 06)
  bannerY: H => H * 0.80,         // CVV banner (cena 06)
  bannerWidth: 400,                // Largura do banner
  bannerHeight: 56,                // Altura do banner
};
