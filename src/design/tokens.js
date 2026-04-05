/**
 * RankEX Design Tokens
 * Fonte unica di verità per tutti i valori di design.
 * Ogni componente legge da qui — mai valori hardcoded.
 */

// ── Spacing ───────────────────────────────────────────────────
// Base 4px — scala geometrica
export const SPACE = {
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}

// ── Tipografia ────────────────────────────────────────────────
export const TYPE = {
  // Font families
  display: "'Montserrat', sans-serif",
  body:    "'Inter', sans-serif",

  // Scale — nome semantico → size/line-height/tracking
  scales: {
    // Display — numeri grandi, hero titles
    hero:    { size: '64px', line: 1,    weight: 900, tracking: '-0.04em' },
    display: { size: '48px', line: 1,    weight: 900, tracking: '-0.03em' },
    title:   { size: '32px', line: 1.1,  weight: 900, tracking: '-0.02em' },
    heading: { size: '24px', line: 1.2,  weight: 700, tracking: '-0.01em' },
    subhead: { size: '18px', line: 1.3,  weight: 700, tracking: '-0.005em' },

    // Body — testo corrente
    large:   { size: '16px', line: 1.6,  weight: 400, tracking: '0' },
    base:    { size: '14px', line: 1.5,  weight: 400, tracking: '0' },
    small:   { size: '13px', line: 1.5,  weight: 400, tracking: '0' },
    tiny:    { size: '12px', line: 1.4,  weight: 400, tracking: '0' },

    // Label — UI elements
    label:   { size: '11px', line: 1,    weight: 700, tracking: '0.08em' },
    caption: { size: '10px', line: 1,    weight: 600, tracking: '0.12em' },
    micro:   { size: '9px',  line: 1,    weight: 700, tracking: '0.15em' },
  },
}

// ── Colori ────────────────────────────────────────────────────
export const COLOR = {
  // Background layers — elevation system
  bg: {
    base:    '#07090e',   // L0 — background puro
    subtle:  '#090d14',   // L0.5 — quasi background
    surface: '#0c1219',   // L1 — surface principale
    raised:  '#0f1820',   // L2 — card elevata
    overlay: '#131e2a',   // L3 — modal/overlay
    float:   '#1a2638',   // L4 — tooltip/dropdown
  },

  // Border — per livello di elevation
  border: {
    subtle:  'rgba(255,255,255,0.04)',
    default: 'rgba(255,255,255,0.08)',
    strong:  'rgba(255,255,255,0.14)',
    focus:   'rgba(14,196,82,0.5)',
  },

  // Testo
  text: {
    primary:   '#e8f0f8',   // testo principale
    secondary: '#8fa5bc',   // testo secondario
    tertiary:  '#4a6070',   // testo disabilitato/placeholder
    inverse:   '#07090e',   // testo su sfondo chiaro
  },

  // Brand — verde logo
  green: {
    50:   'rgba(14,196,82,0.05)',
    100:  'rgba(14,196,82,0.1)',
    200:  'rgba(14,196,82,0.2)',
    400:  '#0ec452',
    500:  '#0db34a',
    neon: '#1dff6b',
    glow: 'rgba(14,196,82,0.25)',
  },

  // Brand — ciano logo
  cyan: {
    50:   'rgba(46,207,255,0.05)',
    100:  'rgba(46,207,255,0.1)',
    200:  'rgba(46,207,255,0.2)',
    400:  '#2ecfff',
    500:  '#1ab8f0',
    bright: '#5dd4ff',
    glow: 'rgba(46,207,255,0.25)',
  },

  // Semantici
  semantic: {
    success: '#0ec452',
    warning: '#f5a623',
    error:   '#f05252',
    info:    '#2ecfff',

    successBg: 'rgba(14,196,82,0.08)',
    warningBg: 'rgba(245,166,35,0.08)',
    errorBg:   'rgba(240,82,82,0.08)',
    infoBg:    'rgba(46,207,255,0.08)',

    successBorder: 'rgba(14,196,82,0.2)',
    warningBorder: 'rgba(245,166,35,0.2)',
    errorBorder:   'rgba(240,82,82,0.2)',
    infoBorder:    'rgba(46,207,255,0.2)',
  },

  // Metallico
  metal: {
    light: '#7a8fa6',
    mid:   '#3d4f63',
    dark:  '#1a2535',
  },
}

// ── Gradienti ─────────────────────────────────────────────────
export const GRADIENT = {
  // Brand — dal logo
  primary: 'linear-gradient(135deg, #1dff6b 0%, #0ec452 35%, #2ecfff 70%, #5dd4ff 100%)',
  green:   'linear-gradient(135deg, #085c28, #0ec452, #1dff6b)',
  cyan:    'linear-gradient(135deg, #1a7fd4, #2ecfff, #5dd4ff)',
  metal:   'linear-gradient(135deg, #1a2535, #3d4f63, #7a8fa6)',

  // Surface — per card
  surface:      'linear-gradient(135deg, #0c1219 0%, #0f1e2e 100%)',
  surfaceHover: 'linear-gradient(135deg, #0f1820 0%, #132030 100%)',

  // Radiali — per glow effects
  glowGreen: 'radial-gradient(ellipse at center, rgba(14,196,82,0.15) 0%, transparent 70%)',
  glowCyan:  'radial-gradient(ellipse at center, rgba(46,207,255,0.15) 0%, transparent 70%)',
}

// ── Shadows ───────────────────────────────────────────────────
export const SHADOW = {
  // Elevation
  sm:  '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
  md:  '0 4px 12px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
  lg:  '0 8px 24px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)',
  xl:  '0 16px 48px rgba(0,0,0,0.6), 0 8px 16px rgba(0,0,0,0.4)',
  '2xl': '0 24px 64px rgba(0,0,0,0.7), 0 12px 24px rgba(0,0,0,0.5)',

  // Glow brand
  green:       '0 0 12px rgba(14,196,82,0.3), 0 0 24px rgba(14,196,82,0.15)',
  greenStrong: '0 0 20px rgba(14,196,82,0.5), 0 0 40px rgba(14,196,82,0.25)',
  cyan:        '0 0 12px rgba(46,207,255,0.3), 0 0 24px rgba(46,207,255,0.15)',
  cyanStrong:  '0 0 20px rgba(46,207,255,0.5), 0 0 40px rgba(46,207,255,0.25)',

  // Inset — per card premium
  insetTop:   'inset 0 1px 0 rgba(255,255,255,0.06)',
  insetGreen: 'inset 0 1px 0 rgba(14,196,82,0.15)',
}

// ── Border Radius ─────────────────────────────────────────────
export const RADIUS = {
  none: '0',
  xs:   '2px',
  sm:   '4px',
  md:   '6px',
  lg:   '8px',
  xl:   '12px',
  '2xl': '16px',
  '3xl': '20px',
  full: '9999px',
}

// ── Motion ────────────────────────────────────────────────────
export const MOTION = {
  // Durata
  duration: {
    instant:  '80ms',
    fast:     '150ms',
    normal:   '220ms',
    slow:     '350ms',
    slower:   '500ms',
  },

  // Easing
  easing: {
    // Standard — la maggior parte delle transizioni
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Decelerate — elementi che entrano
    enter:    'cubic-bezier(0, 0, 0.2, 1)',
    // Accelerate — elementi che escono
    exit:     'cubic-bezier(0.4, 0, 1, 1)',
    // Spring — interazioni fisiche
    spring:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Bounce — feedback positivo
    bounce:   'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Transizioni predefinite
  transition: {
    fast:      'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal:    'all 220ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow:      'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors:    'color 150ms ease, background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
    transform: 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// ── Z-index ───────────────────────────────────────────────────
export const Z = {
  base:     0,
  raised:   10,
  dropdown: 100,
  sticky:   200,
  overlay:  300,
  modal:    400,
  toast:    500,
  tooltip:  600,
}
