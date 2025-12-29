/**
 * Design System Classname Utilities
 * Utility functions for generating Tailwind CSS classes
 * Prevents hardcoded colors throughout the codebase
 */


// ============================================
// TYPE DEFINITIONS
// ============================================

export type MarketStatus = 'bullish' | 'bearish' | 'neutral';
export type Sentiment = 'positive' | 'negative' | 'neutral';
export type AlertLevel = 'info' | 'success' | 'warning' | 'error';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// ============================================
// MARKET STATUS CLASSES
// ============================================

/**
 * Get background + text classes for market status
 * @param status - Market status (bullish, bearish, neutral)
 * @returns Tailwind class string with background and text colors
 */
export function getMarketStatusClasses(status: MarketStatus): string {
  const colors: Record<MarketStatus, string> = {
    bullish: 'bg-green-500/20 text-green-400',
    bearish: 'bg-red-500/20 text-red-400',
    neutral: 'bg-yellow-500/20 text-yellow-400',
  };
  return colors[status];
}

/**
 * Get border classes for market status
 * @param status - Market status (bullish, bearish, neutral)
 * @returns Tailwind class string with border color
 */
export function getMarketStatusBorderClass(status: MarketStatus): string {
  const borders: Record<MarketStatus, string> = {
    bullish: 'border-green-500/50',
    bearish: 'border-red-500/50',
    neutral: 'border-yellow-500/50',
  };
  return borders[status];
}

/**
 * Get full card classes for market status (bg + text + border)
 * @param status - Market status (bullish, bearish, neutral)
 * @returns Tailwind class string for complete card styling
 */
export function getMarketStatusCardClasses(status: MarketStatus): string {
  return `${getMarketStatusClasses(status)} ${getMarketStatusBorderClass(status)} border`;
}

// ============================================
// SENTIMENT CLASSES
// ============================================

/**
 * Get text color class for sentiment
 * @param sentiment - Sentiment value (positive, negative, neutral)
 * @returns Tailwind class string for text color
 */
export function getSentimentTextClass(sentiment: Sentiment): string {
  const colors: Record<Sentiment, string> = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  };
  return colors[sentiment];
}

/**
 * Get background class for sentiment badge
 * @param sentiment - Sentiment value (positive, negative, neutral)
 * @returns Tailwind class string for badge background
 */
export function getSentimentBadgeClasses(sentiment: Sentiment): string {
  const colors: Record<Sentiment, string> = {
    positive: 'bg-green-500/80 text-white',
    negative: 'bg-red-500/80 text-white',
    neutral: 'bg-yellow-500/80 text-gray-900',
  };
  return colors[sentiment];
}

/**
 * Get icon color class for sentiment
 * @param sentiment - Sentiment value (positive, negative, neutral)
 * @returns Tailwind class string for icon color
 */
export function getSentimentIconClass(sentiment: Sentiment): string {
  const colors: Record<Sentiment, string> = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-yellow-500',
  };
  return colors[sentiment];
}

// ============================================
// ALERT LEVEL CLASSES
// ============================================

/**
 * Get classes for alert/notification levels
 * @param level - Alert level (info, success, warning, error)
 * @returns Tailwind class string for alert styling
 */
export function getAlertClasses(level: AlertLevel): string {
  const colors: Record<AlertLevel, string> = {
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    success: 'bg-green-500/20 text-green-400 border-green-500/50',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    error: 'bg-red-500/20 text-red-400 border-red-500/50',
  };
  return colors[level];
}

/**
 * Get icon classes for alert levels
 * @param level - Alert level (info, success, warning, error)
 * @returns Tailwind class string for alert icon
 */
export function getAlertIconClass(level: AlertLevel): string {
  const colors: Record<AlertLevel, string> = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  };
  return colors[level];
}

// ============================================
// RESPONSIVE GRID CLASSES
// ============================================

interface GridColumns {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}

/**
 * Get responsive grid classes
 * @param columns - Object with column counts for each breakpoint
 * @returns Tailwind class string for responsive grid
 *
 * Note: For dynamic column values, ensure Tailwind's safelist includes these classes
 * or use the predefined getResponsiveGridPreset function instead
 */
export function getResponsiveGrid(columns: GridColumns): string {
  const { mobile = 1, tablet = 2, desktop = 4 } = columns;
  return `grid grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`;
}

/**
 * Get predefined responsive grid preset
 * These are commonly used grid configurations that are guaranteed to be in Tailwind's output
 * @param preset - Preset name
 * @returns Tailwind class string for responsive grid
 */
export type GridPreset = 'single' | 'double' | 'triple' | 'quad' | 'cards' | 'dashboard';

export function getResponsiveGridPreset(preset: GridPreset): string {
  const presets: Record<GridPreset, string> = {
    single: 'grid grid-cols-1',
    double: 'grid grid-cols-1 md:grid-cols-2',
    triple: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    quad: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    dashboard: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  };
  return presets[preset];
}

// ============================================
// RESPONSIVE GAP CLASSES
// ============================================

/**
 * Get responsive gap classes
 * @param size - Size variant (xs, sm, md, lg, xl)
 * @returns Tailwind class string for responsive gap
 */
export function getResponsiveGap(size: Size = 'md'): string {
  const gaps: Record<Size, string> = {
    xs: 'gap-1 md:gap-2',
    sm: 'gap-2 md:gap-3 lg:gap-4',
    md: 'gap-3 md:gap-4 lg:gap-6',
    lg: 'gap-4 md:gap-6 lg:gap-8',
    xl: 'gap-6 md:gap-8 lg:gap-10',
  };
  return gaps[size];
}

// ============================================
// RESPONSIVE PADDING CLASSES
// ============================================

/**
 * Get responsive padding classes
 * @param size - Size variant (xs, sm, md, lg, xl)
 * @returns Tailwind class string for responsive padding
 */
export function getResponsivePadding(size: Size = 'md'): string {
  const paddings: Record<Size, string> = {
    xs: 'p-2 md:p-3',
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-5 lg:p-6',
    lg: 'p-5 md:p-6 lg:p-8',
    xl: 'p-6 md:p-8 lg:p-10',
  };
  return paddings[size];
}

// ============================================
// CARD STYLING CLASSES
// ============================================

/**
 * Get base card classes
 * @param variant - Card variant (default, elevated, outlined)
 * @returns Tailwind class string for card styling
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

export function getCardClasses(variant: CardVariant = 'default'): string {
  const base = 'rounded-lg transition-colors';
  const variants: Record<CardVariant, string> = {
    default: `${base} bg-slate-800/50 border border-slate-700`,
    elevated: `${base} bg-slate-800 border border-slate-700 shadow-lg`,
    outlined: `${base} bg-transparent border-2 border-slate-600`,
    glass: `${base} bg-slate-800/30 backdrop-blur-sm border border-slate-700/50`,
  };
  return variants[variant];
}

/**
 * Get card hover effect classes
 * @param intensity - Hover effect intensity
 * @returns Tailwind class string for hover effects
 */
export type HoverIntensity = 'subtle' | 'normal' | 'prominent';

export function getCardHoverClasses(intensity: HoverIntensity = 'normal'): string {
  const hovers: Record<HoverIntensity, string> = {
    subtle: 'hover:bg-slate-700/30',
    normal: 'hover:bg-slate-700/50 hover:border-slate-600',
    prominent: 'hover:bg-slate-700 hover:border-slate-500 hover:shadow-xl',
  };
  return hovers[intensity];
}

// ============================================
// BUTTON STYLING CLASSES
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

/**
 * Get button classes based on variant
 * @param variant - Button variant
 * @param disabled - Whether button is disabled
 * @returns Tailwind class string for button styling
 */
export function getButtonClasses(variant: ButtonVariant = 'primary', disabled = false): string {
  const base = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';

  if (disabled) {
    return `${base} opacity-50 cursor-not-allowed`;
  }

  const variants: Record<ButtonVariant, string> = {
    primary: `${base} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`,
    secondary: `${base} bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500`,
    ghost: `${base} bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500`,
    danger: `${base} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`,
    success: `${base} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`,
  };

  return variants[variant];
}

/**
 * Get button size classes
 * @param size - Button size
 * @returns Tailwind class string for button size
 */
export function getButtonSizeClasses(size: Size = 'md'): string {
  const sizes: Record<Size, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  return sizes[size];
}

// ============================================
// PRICE CHANGE CLASSES
// ============================================

/**
 * Get text color class for price change
 * @param change - Price change value (positive or negative)
 * @returns Tailwind class string for text color
 */
export function getPriceChangeClass(change: number): string {
  if (change > 0) return 'text-green-400';
  if (change < 0) return 'text-red-400';
  return 'text-gray-400';
}

/**
 * Get badge classes for price change
 * @param change - Price change value (positive or negative)
 * @returns Tailwind class string for badge styling
 */
export function getPriceChangeBadgeClasses(change: number): string {
  if (change > 0) return 'bg-green-500/20 text-green-400';
  if (change < 0) return 'bg-red-500/20 text-red-400';
  return 'bg-gray-500/20 text-gray-400';
}

// ============================================
// STATUS INDICATOR CLASSES
// ============================================

export type StatusType = 'online' | 'offline' | 'warning' | 'loading';

/**
 * Get status indicator dot classes
 * @param status - Status type
 * @returns Tailwind class string for status dot
 */
export function getStatusDotClasses(status: StatusType): string {
  const statuses: Record<StatusType, string> = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
    loading: 'bg-blue-500 animate-pulse',
  };
  return `w-2 h-2 rounded-full ${statuses[status]}`;
}

/**
 * Get status badge classes
 * @param status - Status type
 * @returns Tailwind class string for status badge
 */
export function getStatusBadgeClasses(status: StatusType): string {
  const statuses: Record<StatusType, string> = {
    online: 'bg-green-500/20 text-green-400 border-green-500/30',
    offline: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    loading: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  };
  return `px-2 py-1 rounded-full text-xs font-medium border ${statuses[status]}`;
}

// ============================================
// TEXT STYLING CLASSES
// ============================================

/**
 * Get text emphasis classes
 * @param level - Emphasis level (primary, secondary, muted)
 * @returns Tailwind class string for text color
 */
export type TextEmphasis = 'primary' | 'secondary' | 'muted';

export function getTextEmphasisClass(level: TextEmphasis): string {
  const levels: Record<TextEmphasis, string> = {
    primary: 'text-slate-100',
    secondary: 'text-slate-300',
    muted: 'text-slate-500',
  };
  return levels[level];
}

// ============================================
// ANIMATION CLASSES
// ============================================

/**
 * Get skeleton loading animation classes
 * @returns Tailwind class string for skeleton animation
 */
export function getSkeletonClasses(): string {
  return 'animate-pulse bg-slate-700 rounded';
}

/**
 * Get fade-in animation classes
 * @param duration - Animation duration (fast, normal, slow)
 * @returns Tailwind class string for fade-in animation
 */
export type AnimationSpeed = 'fast' | 'normal' | 'slow';

export function getFadeInClasses(duration: AnimationSpeed = 'normal'): string {
  const durations: Record<AnimationSpeed, string> = {
    fast: 'animate-fade-in duration-150',
    normal: 'animate-fade-in duration-300',
    slow: 'animate-fade-in duration-500',
  };
  return durations[duration];
}
