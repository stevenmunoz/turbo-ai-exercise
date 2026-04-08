/**
 * MedFlow Design System — Tokens
 *
 * Synthesized from 5 references:
 *   Airbnb (flow), Hourglass (warmth), Pills (product UX),
 *   Dentexa (ops dashboard), Xenityhealth (KPI analytics)
 *
 * Designed for a medical supply order management tool.
 */

// ─── Colors ───────────────────────────────────────────────────
export const colors = {
  // Primary — trustworthy blue from Dentexa/Xenityhealth, softened for warmth
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#4F6AE8',
    600: '#3B52CC',
    700: '#2E41A3',
    800: '#1E2D6D',
    900: '#141D4A',
  },

  // Accent — warm orange from Xenityhealth, for CTAs and attention
  accent: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },

  // Semantic
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
  },
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
  },

  // Neutrals — warm-tinted grays (not sterile), inspired by Pills/Hourglass
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    150: '#ECEEF1',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#0B0F19',
  },

  // Surfaces — from Hourglass glassmorphic warmth
  surface: {
    page: '#F7F8FA',
    card: '#FFFFFF',
    sidebar: '#111827',
    sidebarHover: '#1F2937',
    sidebarActive: 'linear-gradient(135deg, rgba(79, 106, 232, 0.18), rgba(79, 106, 232, 0.10))',
    overlay: 'rgba(0, 0, 0, 0.5)',
    elevated: '#FFFFFF',
  },
} as const;

// ─── Typography ───────────────────────────────────────────────
export const typography = {
  fontFamily: {
    display: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
    body: "'Inter', 'DM Sans', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '0.75rem',    // 12px — captions, badges
    sm: '0.8125rem',  // 13px — secondary text, labels
    base: '0.875rem', // 14px — body text (dense dashboard)
    md: '1rem',       // 16px — form inputs, prominent body
    lg: '1.125rem',   // 18px — section headers
    xl: '1.25rem',    // 20px — card titles
    '2xl': '1.5rem',  // 24px — page section titles
    '3xl': '1.875rem',// 30px — page titles
    '4xl': '2.25rem', // 36px — KPI numbers
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.08em',
  },
} as const;

// ─── Spacing ──────────────────────────────────────────────────
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const;

// ─── Borders & Radii ─────────────────────────────────────────
export const radii = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
} as const;

export const borders = {
  light: `1px solid ${colors.neutral[200]}`,
  default: `1px solid ${colors.neutral[300]}`,
  dark: `1px solid ${colors.neutral[700]}`,
  focus: `2px solid ${colors.primary[500]}`,
} as const;

// ─── Shadows ──────────────────────────────────────────────────
export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.06), 0 4px 6px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.08), 0 8px 10px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
  focus: `0 0 0 3px ${colors.primary[100]}`,
} as const;

// ─── Transitions ──────────────────────────────────────────────
export const transitions = {
  fast: '120ms ease',
  default: '200ms ease',
  smooth: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ─── Layout ───────────────────────────────────────────────────
export const layout = {
  sidebarWidth: '240px',
  sidebarCollapsed: '64px',
  topBarHeight: '56px',
  contentMaxWidth: '1200px',
  formMaxWidth: '720px',
  cardGap: '16px',
} as const;

// ─── Z-Index Scale ────────────────────────────────────────────
export const zIndex = {
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const;
