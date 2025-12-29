/**
 * 1MarketPulse Design System
 * Centralized design tokens, animations, and utilities
 *
 * @example
 * ```typescript
 * import {
 *   marketColors,
 *   heartbeatColors,
 *   getMarketStatusColor,
 *   animationPresets,
 *   breakpoints,
 *   accessibleMarketColors,
 * } from '@/design-system';
 * ```
 */

// ============================================
// TOKENS
// ============================================
export {
  // Colors
  marketColors,
  heartbeatColors,
  weatherColors,
  darkTheme,

  // Spacing
  spacing,
  spacingPx,
  responsiveSpacing,

  // Typography
  typography,

  // Borders & Shadows
  borderRadius,
  shadows,
  gradients,

  // Z-Index
  zIndex,

  // Transitions
  transitions,

  // Types
  type MarketStatus,
  type HeartbeatState,
  type WeatherCondition,
  type SpacingKey,
} from './tokens';

// ============================================
// ANIMATIONS
// ============================================
export {
  // Keyframe definitions
  keyframes,

  // Heartbeat speeds
  heartbeatSpeeds,
  getHeartbeatDuration,

  // Animation presets
  animationPresets,
  animationClasses,

  // Loading states
  loadingStates,

  // Transition utilities
  transitionPresets,

  // Motion preferences
  prefersReducedMotion,
  getAccessibleAnimation,

  // CSS keyframes string
  keyframesCSS,

  // Types
  type HeartbeatSpeed,
  type AnimationPreset,
  type LoadingState,
} from './animations';

// ============================================
// BREAKPOINTS
// ============================================
export {
  // Breakpoint values
  breakpoints,
  breakpointsPx,

  // Media queries
  mediaQueries,
  tailwindBreakpoints,

  // Grid
  gridColumns,
  gridColumnClasses,

  // Touch targets
  touchTargets,
  touchTargetClasses,

  // Container
  containerWidths,
  containerClasses,

  // Visibility
  visibility,

  // Responsive utilities
  responsivePadding,
  responsiveGap,
  responsiveText,

  // Helper functions
  isBreakpoint,
  getCurrentBreakpoint,
  isTouchDevice,
  getResponsiveValue,
  matchMediaQuery,

  // Types
  type Breakpoint,
  type GridColumnPreset,
  type TouchTargetSize,
} from './breakpoints';

// ============================================
// UTILITIES
// ============================================
export {
  // Market status utilities
  getMarketStatusColor,
  getMarketStatusBg,
  getMarketStatusClasses,

  // Sentiment utilities
  getSentimentGradient,
  getSentimentColor,
  getSentimentClasses,

  // Heartbeat utilities
  getHeartbeatState,
  getHeartbeatColor,
  getHeartbeatGlow,
  getHeartbeatClasses,

  // Weather utilities
  getWeatherCondition,
  getWeatherColors,
  getWeatherIcon,

  // Price formatting
  formatPriceWithColor,
  formatPercentageWithColor,

  // Number formatting
  formatLargeNumber,
  formatVolumeWithColor,

  // Style object utilities
  createMarketStatusStyle,
  createHeartbeatStyle,
  createCardStyle,

  // Classname utilities
  cn,
  conditionalClasses,
} from './utils';

// ============================================
// CLASSNAME UTILITIES
// ============================================
export {
  // Market status classes
  getMarketStatusClasses as getMarketStatusTailwindClasses,
  getMarketStatusBorderClass,
  getMarketStatusCardClasses,

  // Sentiment classes
  getSentimentTextClass,
  getSentimentBadgeClasses,
  getSentimentIconClass,

  // Alert classes
  getAlertClasses,
  getAlertIconClass,

  // Responsive grid classes
  getResponsiveGrid,
  getResponsiveGridPreset,
  getResponsiveGap,
  getResponsivePadding,

  // Card classes
  getCardClasses,
  getCardHoverClasses,

  // Button classes
  getButtonClasses,
  getButtonSizeClasses,

  // Price change classes
  getPriceChangeClass,
  getPriceChangeBadgeClasses,

  // Status indicator classes
  getStatusDotClasses,
  getStatusBadgeClasses,

  // Text styling classes
  getTextEmphasisClass,

  // Animation classes
  getSkeletonClasses,
  getFadeInClasses,

  // Types
  type MarketStatus as ClassMarketStatus,
  type Sentiment,
  type AlertLevel,
  type Size,
  type GridPreset,
  type CardVariant,
  type HoverIntensity,
  type ButtonVariant,
  type StatusType,
  type TextEmphasis,
  type AnimationSpeed,
} from './classnames';

// ============================================
// ACCESSIBLE COLORS
// ============================================
export {
  // Accessible text colors
  accessibleTextColors,

  // Accessible market colors
  accessibleMarketColors,
  accessibleHeartbeatColors,

  // Focus ring styles
  focusRing,
  focusRingClasses,

  // Interactive states
  interactiveStates,

  // Skip link styles
  skipLinkStyles,
  skipLinkClasses,

  // Contrast utilities
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  getAccessibleTextColor,

  // ARIA utilities
  ariaLabels,

  // Types
  type AccessibleMarketStatus,
  type InteractiveState,
} from './accessible-colors';
