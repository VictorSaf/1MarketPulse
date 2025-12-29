/**
 * Responsive Breakpoints System
 * Centralized responsive design definitions for 1MarketPulse
 */

// ============================================
// BREAKPOINT VALUES
// ============================================

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
  ultrawide: 1920,
} as const;

export const breakpointsPx = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
  ultrawide: '1920px',
} as const;

// ============================================
// MEDIA QUERY STRINGS
// ============================================

export const mediaQueries = {
  // Min-width (mobile-first)
  mobile: `@media (min-width: ${breakpoints.mobile}px)`,
  tablet: `@media (min-width: ${breakpoints.tablet}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
  wide: `@media (min-width: ${breakpoints.wide}px)`,
  ultrawide: `@media (min-width: ${breakpoints.ultrawide}px)`,

  // Max-width (desktop-first)
  mobileMax: `@media (max-width: ${breakpoints.tablet - 1}px)`,
  tabletMax: `@media (max-width: ${breakpoints.desktop - 1}px)`,
  desktopMax: `@media (max-width: ${breakpoints.wide - 1}px)`,
  wideMax: `@media (max-width: ${breakpoints.ultrawide - 1}px)`,

  // Range queries
  tabletOnly: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.desktop - 1}px)`,
  desktopOnly: `@media (min-width: ${breakpoints.desktop}px) and (max-width: ${breakpoints.wide - 1}px)`,

  // Special queries
  touch: '@media (hover: none) and (pointer: coarse)',
  mouse: '@media (hover: hover) and (pointer: fine)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  darkMode: '@media (prefers-color-scheme: dark)',
  lightMode: '@media (prefers-color-scheme: light)',
  highContrast: '@media (prefers-contrast: high)',
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
} as const;

// ============================================
// TAILWIND-COMPATIBLE PREFIXES
// ============================================

export const tailwindBreakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Tablets
  lg: '1024px',  // Desktops
  xl: '1280px',  // Large desktops
  '2xl': '1536px', // Extra large
} as const;

// ============================================
// GRID COLUMN PRESETS
// ============================================

export const gridColumns = {
  mobile: 1,
  tablet: 2,
  desktop: 3,
  wide: 4,
} as const;

export const gridColumnClasses = {
  // Responsive grid columns
  responsive: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  responsiveCompact: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  responsiveWide: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',

  // Fixed grids
  oneColumn: 'grid-cols-1',
  twoColumns: 'grid-cols-2',
  threeColumns: 'grid-cols-3',
  fourColumns: 'grid-cols-4',

  // Auto-fit grids
  autoFit: 'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]',
  autoFitSmall: 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
  autoFitLarge: 'grid-cols-[repeat(auto-fit,minmax(320px,1fr))]',
} as const;

// ============================================
// TOUCH TARGET SIZES
// ============================================

export const touchTargets = {
  minimum: '44px',      // WCAG minimum
  comfortable: '48px',  // Recommended
  large: '56px',        // For primary actions
} as const;

export const touchTargetClasses = {
  minimum: 'min-h-[44px] min-w-[44px]',
  comfortable: 'min-h-[48px] min-w-[48px]',
  large: 'min-h-[56px] min-w-[56px]',
} as const;

// ============================================
// CONTAINER WIDTHS
// ============================================

export const containerWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

export const containerClasses = {
  default: 'container mx-auto px-4 md:px-6 lg:px-8',
  narrow: 'container mx-auto max-w-4xl px-4 md:px-6',
  wide: 'container mx-auto max-w-7xl px-4 md:px-6 lg:px-8',
  full: 'w-full px-4 md:px-6 lg:px-8',
} as const;

// ============================================
// VISIBILITY UTILITIES
// ============================================

export const visibility = {
  // Hide on specific breakpoints
  hideOnMobile: 'hidden md:block',
  hideOnTablet: 'md:hidden lg:block',
  hideOnDesktop: 'lg:hidden',

  // Show only on specific breakpoints
  showOnMobile: 'md:hidden',
  showOnTablet: 'hidden md:block lg:hidden',
  showOnDesktop: 'hidden lg:block',

  // Screen reader only
  srOnly: 'sr-only',
  notSrOnly: 'not-sr-only',
} as const;

// ============================================
// RESPONSIVE SPACING
// ============================================

export const responsivePadding = {
  card: 'p-3 md:p-4 lg:p-6',
  section: 'py-8 md:py-12 lg:py-16',
  page: 'px-4 md:px-6 lg:px-8',
} as const;

export const responsiveGap = {
  sm: 'gap-2 md:gap-3 lg:gap-4',
  md: 'gap-3 md:gap-4 lg:gap-6',
  lg: 'gap-4 md:gap-6 lg:gap-8',
} as const;

// ============================================
// RESPONSIVE TEXT
// ============================================

export const responsiveText = {
  heading1: 'text-2xl md:text-3xl lg:text-4xl',
  heading2: 'text-xl md:text-2xl lg:text-3xl',
  heading3: 'text-lg md:text-xl lg:text-2xl',
  body: 'text-sm md:text-base',
  small: 'text-xs md:text-sm',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if current viewport matches a breakpoint
 * @param breakpoint - The breakpoint to check
 * @returns Boolean indicating if viewport is at or above breakpoint
 */
export function isBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
}

/**
 * Get current breakpoint name
 * @returns Current breakpoint name
 */
export function getCurrentBreakpoint(): keyof typeof breakpoints {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;

  if (width >= breakpoints.ultrawide) return 'ultrawide';
  if (width >= breakpoints.wide) return 'wide';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.tablet) return 'tablet';
  return 'mobile';
}

/**
 * Check if device is touch-enabled
 * @returns Boolean indicating touch capability
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get responsive value based on breakpoint
 * @param values - Object with breakpoint-keyed values
 * @returns Value for current breakpoint
 */
export function getResponsiveValue<T>(values: Partial<Record<keyof typeof breakpoints, T>>): T | undefined {
  const currentBreakpoint = getCurrentBreakpoint();
  const orderedBreakpoints: (keyof typeof breakpoints)[] = ['ultrawide', 'wide', 'desktop', 'tablet', 'mobile'];

  const currentIndex = orderedBreakpoints.indexOf(currentBreakpoint);

  for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
    const bp = orderedBreakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }

  return undefined;
}

/**
 * Create a media query hook value (for React)
 * @param query - Media query string
 * @returns Boolean indicating if query matches
 */
export function matchMediaQuery(query: string): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query.replace('@media ', '')).matches;
}

// ============================================
// TYPE EXPORTS
// ============================================

export type Breakpoint = keyof typeof breakpoints;
export type GridColumnPreset = keyof typeof gridColumnClasses;
export type TouchTargetSize = keyof typeof touchTargets;
