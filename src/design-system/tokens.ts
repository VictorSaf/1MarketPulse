/**
 * Design System Tokens
 * Centralized design tokens for 1MarketPulse
 */

// ============================================
// MARKET STATUS COLORS
// ============================================

export const marketColors = {
  bullish: {
    primary: '#10B981',      // Emerald 500
    light: '#34D399',        // Emerald 400
    dark: '#059669',         // Emerald 600
    bg: '#064E3B',           // Emerald 900
    bgLight: 'rgba(16, 185, 129, 0.1)',
    bgMedium: 'rgba(16, 185, 129, 0.2)',
  },
  bearish: {
    primary: '#EF4444',      // Red 500
    light: '#F87171',        // Red 400
    dark: '#DC2626',         // Red 600
    bg: '#7F1D1D',           // Red 900
    bgLight: 'rgba(239, 68, 68, 0.1)',
    bgMedium: 'rgba(239, 68, 68, 0.2)',
  },
  neutral: {
    primary: '#6B7280',      // Gray 500
    light: '#9CA3AF',        // Gray 400
    dark: '#4B5563',         // Gray 600
    bg: '#1F2937',           // Gray 800
    bgLight: 'rgba(107, 114, 128, 0.1)',
    bgMedium: 'rgba(107, 114, 128, 0.2)',
  },
} as const;

// ============================================
// HEARTBEAT STATE COLORS
// ============================================

export const heartbeatColors = {
  comatose: {
    primary: '#6B7280',      // Gray - very low activity
    glow: 'rgba(107, 114, 128, 0.4)',
    bg: 'rgba(107, 114, 128, 0.1)',
    bpmRange: [0, 20],
  },
  calm: {
    primary: '#10B981',      // Green - low activity
    glow: 'rgba(16, 185, 129, 0.4)',
    bg: 'rgba(16, 185, 129, 0.1)',
    bpmRange: [21, 40],
  },
  alert: {
    primary: '#F59E0B',      // Amber - moderate activity
    glow: 'rgba(245, 158, 11, 0.4)',
    bg: 'rgba(245, 158, 11, 0.1)',
    bpmRange: [41, 60],
  },
  excited: {
    primary: '#F97316',      // Orange - high activity
    glow: 'rgba(249, 115, 22, 0.4)',
    bg: 'rgba(249, 115, 22, 0.1)',
    bpmRange: [61, 80],
  },
  panic: {
    primary: '#EF4444',      // Red - extreme activity
    glow: 'rgba(239, 68, 68, 0.4)',
    bg: 'rgba(239, 68, 68, 0.1)',
    bpmRange: [81, 100],
  },
} as const;

// ============================================
// WEATHER CONDITION COLORS
// ============================================

export const weatherColors = {
  sunny: {
    primary: '#FCD34D',      // Yellow/Golden
    secondary: '#F59E0B',
    bg: 'linear-gradient(135deg, rgba(252, 211, 77, 0.2), rgba(245, 158, 11, 0.1))',
    icon: '☀️',
  },
  partlyCloudy: {
    primary: '#93C5FD',      // Light blue
    secondary: '#FBBF24',
    bg: 'linear-gradient(135deg, rgba(147, 197, 253, 0.2), rgba(251, 191, 36, 0.1))',
    icon: '⛅',
  },
  cloudy: {
    primary: '#9CA3AF',      // Gray
    secondary: '#6B7280',
    bg: 'linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(107, 114, 128, 0.1))',
    icon: '☁️',
  },
  rainy: {
    primary: '#60A5FA',      // Blue
    secondary: '#3B82F6',
    bg: 'linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(59, 130, 246, 0.1))',
    icon: '🌧️',
  },
  stormy: {
    primary: '#8B5CF6',      // Purple
    secondary: '#EF4444',
    bg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(239, 68, 68, 0.1))',
    icon: '⛈️',
  },
} as const;

// ============================================
// SPACING SCALE
// ============================================

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
} as const;

export const spacingPx = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const;

// Responsive spacing classes (Tailwind-compatible)
export const responsiveSpacing = {
  gap: {
    mobile: 'gap-2',
    tablet: 'md:gap-4',
    desktop: 'lg:gap-6',
  },
  padding: {
    mobile: 'p-3',
    tablet: 'md:p-4',
    desktop: 'lg:p-6',
  },
  margin: {
    mobile: 'm-2',
    tablet: 'md:m-4',
    desktop: 'lg:m-6',
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  // Glow shadows for market states
  glow: {
    bullish: '0 0 20px rgba(16, 185, 129, 0.3)',
    bearish: '0 0 20px rgba(239, 68, 68, 0.3)',
    neutral: '0 0 20px rgba(107, 114, 128, 0.3)',
  },
} as const;

// ============================================
// GRADIENTS
// ============================================

export const gradients = {
  // Market gradients
  bullish: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  bearish: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
  neutral: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',

  // Background gradients
  darkCard: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
  glassCard: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',

  // Sentiment gradients
  veryBullish: 'linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%)',
  veryBearish: 'linear-gradient(135deg, #EF4444 0%, #F87171 50%, #FCA5A5 100%)',
  mixed: 'linear-gradient(135deg, #EF4444 0%, #6B7280 50%, #10B981 100%)',

  // Special gradients
  premium: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
  info: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
  error: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ============================================
// TRANSITIONS
// ============================================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================
// DARK THEME BASE COLORS
// ============================================

export const darkTheme = {
  bg: {
    primary: '#0F172A',      // Slate 900
    secondary: '#1E293B',    // Slate 800
    tertiary: '#334155',     // Slate 700
    elevated: '#1E293B',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: '#F8FAFC',      // Slate 50
    secondary: '#CBD5E1',    // Slate 300
    tertiary: '#94A3B8',     // Slate 400
    muted: '#64748B',        // Slate 500
  },
  border: {
    primary: '#334155',      // Slate 700
    secondary: '#475569',    // Slate 600
    focus: '#3B82F6',        // Blue 500
  },
  accent: {
    purple: '#A855F7',       // Purple 500
    blue: '#3B82F6',         // Blue 500
    green: '#10B981',        // Emerald 500
    red: '#EF4444',          // Red 500
    amber: '#F59E0B',        // Amber 500
    orange: '#F97316',       // Orange 500
  },
} as const;

// ============================================
// TYPE EXPORTS
// ============================================

export type MarketStatus = keyof typeof marketColors;
export type HeartbeatState = keyof typeof heartbeatColors;
export type WeatherCondition = keyof typeof weatherColors;
export type SpacingKey = keyof typeof spacing;
