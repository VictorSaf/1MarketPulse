/**
 * Design System Utility Functions
 * Helper functions for styling and formatting in 1MarketPulse
 */

import { marketColors, heartbeatColors, weatherColors, gradients, darkTheme } from './tokens';
import type { MarketStatus, HeartbeatState, WeatherCondition } from './tokens';

// ============================================
// MARKET STATUS UTILITIES
// ============================================

/**
 * Get text color based on market status
 * @param status - Market status (bullish, bearish, neutral)
 * @returns CSS color string
 */
export function getMarketStatusColor(status: MarketStatus | string): string {
  switch (status) {
    case 'bullish':
      return marketColors.bullish.primary;
    case 'bearish':
      return marketColors.bearish.primary;
    case 'neutral':
    default:
      return marketColors.neutral.primary;
  }
}

/**
 * Get background color based on market status
 * @param status - Market status (bullish, bearish, neutral)
 * @returns CSS color string
 */
export function getMarketStatusBg(status: MarketStatus | string): string {
  switch (status) {
    case 'bullish':
      return marketColors.bullish.bgLight;
    case 'bearish':
      return marketColors.bearish.bgLight;
    case 'neutral':
    default:
      return marketColors.neutral.bgLight;
  }
}

/**
 * Get Tailwind classes for market status
 * @param status - Market status (bullish, bearish, neutral)
 * @returns Tailwind class string
 */
export function getMarketStatusClasses(status: MarketStatus | string): string {
  switch (status) {
    case 'bullish':
      return 'text-emerald-500 bg-emerald-500/10';
    case 'bearish':
      return 'text-red-500 bg-red-500/10';
    case 'neutral':
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
}

// ============================================
// SENTIMENT UTILITIES
// ============================================

/**
 * Get gradient based on sentiment value
 * @param sentiment - Sentiment value (-100 to 100)
 * @returns CSS gradient string
 */
export function getSentimentGradient(sentiment: number): string {
  if (sentiment >= 50) {
    return gradients.veryBullish;
  } else if (sentiment >= 20) {
    return gradients.bullish;
  } else if (sentiment <= -50) {
    return gradients.veryBearish;
  } else if (sentiment <= -20) {
    return gradients.bearish;
  } else {
    return gradients.mixed;
  }
}

/**
 * Get color based on sentiment value
 * @param sentiment - Sentiment value (-100 to 100)
 * @returns CSS color string
 */
export function getSentimentColor(sentiment: number): string {
  if (sentiment >= 20) {
    return marketColors.bullish.primary;
  } else if (sentiment <= -20) {
    return marketColors.bearish.primary;
  }
  return marketColors.neutral.primary;
}

/**
 * Get Tailwind classes for sentiment
 * @param sentiment - Sentiment value (-100 to 100)
 * @returns Tailwind class string
 */
export function getSentimentClasses(sentiment: number): string {
  if (sentiment >= 20) {
    return 'text-emerald-500';
  } else if (sentiment <= -20) {
    return 'text-red-500';
  }
  return 'text-gray-500';
}

// ============================================
// HEARTBEAT STATE UTILITIES
// ============================================

/**
 * Get heartbeat state based on BPM value
 * @param bpm - Beats per minute (0-100 scale)
 * @returns HeartbeatState
 */
export function getHeartbeatState(bpm: number): HeartbeatState {
  if (bpm <= 20) return 'comatose';
  if (bpm <= 40) return 'calm';
  if (bpm <= 60) return 'alert';
  if (bpm <= 80) return 'excited';
  return 'panic';
}

/**
 * Get heartbeat color based on BPM value
 * @param bpm - Beats per minute (0-100 scale)
 * @returns CSS color string
 */
export function getHeartbeatColor(bpm: number): string {
  const state = getHeartbeatState(bpm);
  return heartbeatColors[state].primary;
}

/**
 * Get heartbeat glow color based on BPM value
 * @param bpm - Beats per minute (0-100 scale)
 * @returns CSS color string for glow effect
 */
export function getHeartbeatGlow(bpm: number): string {
  const state = getHeartbeatState(bpm);
  return heartbeatColors[state].glow;
}

/**
 * Get heartbeat Tailwind classes based on BPM value
 * @param bpm - Beats per minute (0-100 scale)
 * @returns Tailwind class string
 */
export function getHeartbeatClasses(bpm: number): string {
  const state = getHeartbeatState(bpm);
  const colorMap: Record<HeartbeatState, string> = {
    comatose: 'text-gray-500',
    calm: 'text-emerald-500',
    alert: 'text-amber-500',
    excited: 'text-orange-500',
    panic: 'text-red-500',
  };
  return colorMap[state];
}

// ============================================
// WEATHER CONDITION UTILITIES
// ============================================

/**
 * Get weather condition based on volatility and sentiment
 * @param volatility - Market volatility (0-100)
 * @param sentiment - Market sentiment (-100 to 100)
 * @returns WeatherCondition
 */
export function getWeatherCondition(volatility: number, sentiment: number): WeatherCondition {
  // High volatility with negative sentiment = stormy
  if (volatility > 70 && sentiment < -30) {
    return 'stormy';
  }
  // High volatility with mixed sentiment = rainy
  if (volatility > 50) {
    return 'rainy';
  }
  // Low volatility with positive sentiment = sunny
  if (volatility < 30 && sentiment > 30) {
    return 'sunny';
  }
  // Low volatility with mixed sentiment = partly cloudy
  if (volatility < 50 && sentiment > -10) {
    return 'partlyCloudy';
  }
  // Default = cloudy
  return 'cloudy';
}

/**
 * Get weather colors based on condition
 * @param condition - Weather condition
 * @returns Weather color object
 */
export function getWeatherColors(condition: WeatherCondition) {
  return weatherColors[condition];
}

/**
 * Get weather icon based on condition
 * @param condition - Weather condition
 * @returns Emoji icon string
 */
export function getWeatherIcon(condition: WeatherCondition): string {
  return weatherColors[condition].icon;
}

// ============================================
// PRICE FORMATTING UTILITIES
// ============================================

/**
 * Format price with appropriate color based on change
 * @param price - Current price
 * @param change - Price change (positive or negative)
 * @returns Object with formatted value and color
 */
export function formatPriceWithColor(price: number, change: number): {
  value: string;
  color: string;
  colorClass: string;
} {
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  if (change > 0) {
    return {
      value: formattedValue,
      color: marketColors.bullish.primary,
      colorClass: 'text-emerald-500',
    };
  } else if (change < 0) {
    return {
      value: formattedValue,
      color: marketColors.bearish.primary,
      colorClass: 'text-red-500',
    };
  }
  return {
    value: formattedValue,
    color: darkTheme.text.primary,
    colorClass: 'text-gray-100',
  };
}

/**
 * Format percentage with appropriate color
 * @param value - Percentage value
 * @returns Object with formatted value and color
 */
export function formatPercentageWithColor(value: number): {
  value: string;
  color: string;
  colorClass: string;
  arrow: string;
} {
  const sign = value >= 0 ? '+' : '';
  const formattedValue = `${sign}${value.toFixed(2)}%`;

  if (value > 0) {
    return {
      value: formattedValue,
      color: marketColors.bullish.primary,
      colorClass: 'text-emerald-500',
      arrow: '\u2191', // Up arrow
    };
  } else if (value < 0) {
    return {
      value: formattedValue,
      color: marketColors.bearish.primary,
      colorClass: 'text-red-500',
      arrow: '\u2193', // Down arrow
    };
  }
  return {
    value: formattedValue,
    color: marketColors.neutral.primary,
    colorClass: 'text-gray-500',
    arrow: '-',
  };
}

// ============================================
// NUMBER FORMATTING UTILITIES
// ============================================

/**
 * Format large numbers with abbreviations
 * @param value - Number to format
 * @returns Formatted string (e.g., 1.5M, 2.3B)
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

/**
 * Format volume with color based on comparison to average
 * @param volume - Current volume
 * @param averageVolume - Average volume for comparison
 * @returns Object with formatted value and color
 */
export function formatVolumeWithColor(volume: number, averageVolume: number): {
  value: string;
  color: string;
  colorClass: string;
  isHighVolume: boolean;
} {
  const formattedValue = formatLargeNumber(volume);
  const isHighVolume = volume > averageVolume * 1.5;

  if (isHighVolume) {
    return {
      value: formattedValue,
      color: marketColors.bullish.primary,
      colorClass: 'text-emerald-500',
      isHighVolume: true,
    };
  }
  return {
    value: formattedValue,
    color: darkTheme.text.secondary,
    colorClass: 'text-gray-400',
    isHighVolume: false,
  };
}

// ============================================
// STYLE OBJECT UTILITIES
// ============================================

/**
 * Create a style object for market status
 * @param status - Market status
 * @returns CSS style object
 */
export function createMarketStatusStyle(status: MarketStatus | string): React.CSSProperties {
  return {
    color: getMarketStatusColor(status),
    backgroundColor: getMarketStatusBg(status),
  };
}

/**
 * Create a style object for heartbeat
 * @param bpm - Beats per minute
 * @returns CSS style object
 */
export function createHeartbeatStyle(bpm: number): React.CSSProperties {
  const state = getHeartbeatState(bpm);
  return {
    color: heartbeatColors[state].primary,
    boxShadow: `0 0 15px ${heartbeatColors[state].glow}`,
  };
}

/**
 * Create a card style with optional status
 * @param status - Optional market status for border color
 * @returns CSS style object
 */
export function createCardStyle(status?: MarketStatus | string): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    backgroundColor: darkTheme.bg.secondary,
    borderRadius: '0.5rem',
    border: `1px solid ${darkTheme.border.primary}`,
  };

  if (status) {
    baseStyle.borderColor = getMarketStatusColor(status);
  }

  return baseStyle;
}

// ============================================
// CLASSNAME UTILITIES
// ============================================

/**
 * Combine class names, filtering out falsy values
 * @param classes - Class names to combine
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create conditional class object
 * @param baseClasses - Base classes always applied
 * @param conditionalClasses - Object of conditional classes
 * @returns Combined class string
 */
export function conditionalClasses(
  baseClasses: string,
  conditionalClasses: Record<string, boolean>
): string {
  const activeConditionals = Object.entries(conditionalClasses)
    .filter(([, condition]) => condition)
    .map(([className]) => className)
    .join(' ');

  return `${baseClasses} ${activeConditionals}`.trim();
}
