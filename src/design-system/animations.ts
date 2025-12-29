/**
 * Animation Presets
 * Centralized animation definitions for 1MarketPulse
 */

import { transitions } from './tokens';

// ============================================
// KEYFRAME DEFINITIONS (CSS-in-JS format)
// ============================================

export const keyframes = {
  // Heartbeat animation
  heartbeat: {
    '0%, 100%': { transform: 'scale(1)' },
    '14%': { transform: 'scale(1.3)' },
    '28%': { transform: 'scale(1)' },
    '42%': { transform: 'scale(1.3)' },
    '70%': { transform: 'scale(1)' },
  },

  // Pulse animation
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },

  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },

  // Slide animations
  slideInUp: {
    from: { transform: 'translateY(20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInDown: {
    from: { transform: 'translateY(-20px)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
  },
  slideInLeft: {
    from: { transform: 'translateX(-20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideInRight: {
    from: { transform: 'translateX(20px)', opacity: 0 },
    to: { transform: 'translateX(0)', opacity: 1 },
  },
  slideOutUp: {
    from: { transform: 'translateY(0)', opacity: 1 },
    to: { transform: 'translateY(-20px)', opacity: 0 },
  },
  slideOutDown: {
    from: { transform: 'translateY(0)', opacity: 1 },
    to: { transform: 'translateY(20px)', opacity: 0 },
  },

  // Scale animations
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: 1 },
    to: { transform: 'scale(0.95)', opacity: 0 },
  },
  scaleUp: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.05)' },
  },
  scaleDown: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(0.95)' },
  },

  // Bounce animation
  bounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },

  // Spin animation
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },

  // Shimmer animation (for skeleton loading)
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },

  // Glow animation
  glow: {
    '0%, 100%': { boxShadow: '0 0 5px currentColor' },
    '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
  },

  // Shake animation (for errors)
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
  },

  // Ping animation (for notifications)
  ping: {
    '75%, 100%': { transform: 'scale(2)', opacity: 0 },
  },

  // Float animation
  float: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-5px)' },
  },
} as const;

// ============================================
// HEARTBEAT ANIMATION SPEEDS
// ============================================

export const heartbeatSpeeds = {
  comatose: '3s',     // Very slow - low activity
  calm: '2s',         // Slow - normal activity
  alert: '1.2s',      // Medium - moderate activity
  excited: '0.8s',    // Fast - high activity
  panic: '0.5s',      // Very fast - extreme activity
} as const;

/**
 * Get heartbeat animation duration based on BPM
 * @param bpm - Beats per minute (0-100 scale)
 * @returns Animation duration string
 */
export function getHeartbeatDuration(bpm: number): string {
  if (bpm <= 20) return heartbeatSpeeds.comatose;
  if (bpm <= 40) return heartbeatSpeeds.calm;
  if (bpm <= 60) return heartbeatSpeeds.alert;
  if (bpm <= 80) return heartbeatSpeeds.excited;
  return heartbeatSpeeds.panic;
}

// ============================================
// ANIMATION PRESETS (CSS strings)
// ============================================

export const animationPresets = {
  // Heartbeat animations
  heartbeatSlow: 'heartbeat 2s ease-in-out infinite',
  heartbeatNormal: 'heartbeat 1.2s ease-in-out infinite',
  heartbeatFast: 'heartbeat 0.8s ease-in-out infinite',
  heartbeatPanic: 'heartbeat 0.5s ease-in-out infinite',

  // Fade animations
  fadeIn: `fadeIn ${transitions.duration.normal} ${transitions.timing.easeOut}`,
  fadeInSlow: `fadeIn ${transitions.duration.slow} ${transitions.timing.easeOut}`,
  fadeOut: `fadeOut ${transitions.duration.normal} ${transitions.timing.easeIn}`,

  // Slide animations
  slideInUp: `slideInUp ${transitions.duration.normal} ${transitions.timing.easeOut}`,
  slideInDown: `slideInDown ${transitions.duration.normal} ${transitions.timing.easeOut}`,
  slideInLeft: `slideInLeft ${transitions.duration.normal} ${transitions.timing.easeOut}`,
  slideInRight: `slideInRight ${transitions.duration.normal} ${transitions.timing.easeOut}`,

  // Scale animations
  scaleIn: `scaleIn ${transitions.duration.normal} ${transitions.timing.easeOut}`,
  scaleOut: `scaleOut ${transitions.duration.normal} ${transitions.timing.easeIn}`,

  // Continuous animations
  pulse: 'pulse 2s ease-in-out infinite',
  pulseFast: 'pulse 1s ease-in-out infinite',
  spin: 'spin 1s linear infinite',
  spinSlow: 'spin 2s linear infinite',
  bounce: 'bounce 1s ease-in-out infinite',
  float: 'float 3s ease-in-out infinite',
  glow: 'glow 2s ease-in-out infinite',
  shimmer: 'shimmer 2s linear infinite',

  // Utility animations
  shake: 'shake 0.5s ease-in-out',
  ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
} as const;

// ============================================
// TAILWIND-COMPATIBLE ANIMATION CLASSES
// ============================================

export const animationClasses = {
  // Base animations
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  bounce: 'animate-bounce',

  // Custom animations (require Tailwind config)
  fadeIn: 'animate-fadeIn',
  fadeOut: 'animate-fadeOut',
  slideUp: 'animate-slideUp',
  slideDown: 'animate-slideDown',
  scaleIn: 'animate-scaleIn',
  heartbeat: 'animate-heartbeat',
  shimmer: 'animate-shimmer',
  float: 'animate-float',
  glow: 'animate-glow',
} as const;

// ============================================
// LOADING STATE ANIMATIONS
// ============================================

export const loadingStates = {
  spinner: {
    animation: 'spin 1s linear infinite',
    className: 'animate-spin',
  },
  skeleton: {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    className: 'animate-pulse bg-gray-700',
    style: {
      backgroundColor: '#374151',
    },
  },
  shimmer: {
    animation: 'shimmer 2s linear infinite',
    className: 'animate-shimmer',
    style: {
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      backgroundSize: '200% 100%',
    },
  },
  dots: {
    animation: 'pulse 1.5s ease-in-out infinite',
    className: 'animate-pulse',
  },
} as const;

// ============================================
// TRANSITION UTILITIES
// ============================================

export const transitionPresets = {
  default: `all ${transitions.duration.normal} ${transitions.timing.easeInOut}`,
  fast: `all ${transitions.duration.fast} ${transitions.timing.easeInOut}`,
  slow: `all ${transitions.duration.slow} ${transitions.timing.easeInOut}`,
  colors: `background-color ${transitions.duration.normal} ${transitions.timing.easeInOut}, border-color ${transitions.duration.normal} ${transitions.timing.easeInOut}, color ${transitions.duration.normal} ${transitions.timing.easeInOut}`,
  transform: `transform ${transitions.duration.normal} ${transitions.timing.easeOut}`,
  opacity: `opacity ${transitions.duration.normal} ${transitions.timing.easeInOut}`,
  shadow: `box-shadow ${transitions.duration.normal} ${transitions.timing.easeInOut}`,
} as const;

// ============================================
// MOTION PREFERENCES
// ============================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation based on motion preference
 * Returns 'none' if user prefers reduced motion
 */
export function getAccessibleAnimation(animation: string): string {
  if (prefersReducedMotion()) return 'none';
  return animation;
}

// ============================================
// CSS KEYFRAMES STRING (for injection)
// ============================================

export const keyframesCSS = `
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes scaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes ping {
  75%, 100% { transform: scale(2); opacity: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
`;

// ============================================
// TYPE EXPORTS
// ============================================

export type HeartbeatSpeed = keyof typeof heartbeatSpeeds;
export type AnimationPreset = keyof typeof animationPresets;
export type LoadingState = keyof typeof loadingStates;
