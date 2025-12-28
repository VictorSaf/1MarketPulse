/**
 * StatisticsChart Component
 *
 * Displays statistics in various chart formats (bar, line, radial).
 */

import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

import { Card } from './ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
  suffix?: string;
}

export function StatCard({
  label,
  value,
  change,
  trend = 'neutral',
  icon,
  color = 'text-blue-400',
  suffix = '',
}: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') {return <TrendingUp className="w-4 h-4 text-green-400" />;}
    if (trend === 'down') {return <TrendingDown className="w-4 h-4 text-red-400" />;}
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') {return 'text-green-300 bg-green-500/10 border-green-500/30';}
    if (trend === 'down') {return 'text-red-300 bg-red-500/10 border-red-500/30';}
    return 'text-gray-300 bg-gray-500/10 border-gray-500/30';
  };

  return (
    <Card className="p-6 bg-gray-800/50 border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
      <div className="flex items-center justify-between mb-3">
        {icon && <div className={color}>{icon}</div>}
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-md border ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-xs font-medium">{change}</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">
        {value}
        {suffix && <span className="text-lg text-gray-400 ml-1">{suffix}</span>}
      </p>
      <p className="text-sm text-gray-400">{label}</p>
    </Card>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  label,
  value,
  max,
  color = 'bg-blue-500',
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorByPercentage = (pct: number) => {
    if (pct >= 90) {return 'bg-red-500';}
    if (pct >= 70) {return 'bg-yellow-500';}
    return 'bg-green-500';
  };

  const barColor = color === 'auto' ? getColorByPercentage(percentage) : color;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{label}</span>
        {showPercentage && (
          <span className="text-white font-medium">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'neutral';
}

export function MetricRow({ label, value, subValue, icon, status = 'neutral' }: MetricRowProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-300';
      case 'warning':
        return 'text-yellow-300';
      case 'error':
        return 'text-red-300';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        {icon && <div className="text-gray-400">{icon}</div>}
        <div>
          <p className="text-white font-medium">{label}</p>
          {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
        </div>
      </div>
      <p className={`text-lg font-semibold ${getStatusColor()}`}>{value}</p>
    </div>
  );
}

interface RadialProgressProps {
  label: string;
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function RadialProgress({
  label,
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#3b82f6',
}: RadialProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColorByPercentage = (pct: number) => {
    if (pct >= 90) {return '#ef4444';} // red
    if (pct >= 70) {return '#eab308';} // yellow
    if (pct >= 50) {return '#3b82f6';} // blue
    return '#22c55e'; // green
  };

  const strokeColor = color === 'auto' ? getColorByPercentage(percentage) : color;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" height={size} width={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-500 ease-out"
            cx={size / 2}
            cy={size / 2}
            fill="none"
            r={radius}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth={strokeWidth}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</p>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-400 text-center">{label}</p>
    </div>
  );
}

interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  showDots?: boolean;
}

export function MiniSparkline({ data, color = '#3b82f6', height = 40, showDots = false }: MiniSparklineProps) {
  if (data.length === 0) {return null;}

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = data.length * 8;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="inline-block" height={height} width={width}>
      <polyline
        fill="none"
        points={points}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      {showDots && data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return <circle key={index} cx={x} cy={y} fill={color} r="2" />;
      })}
    </svg>
  );
}

interface StatsGridProps {
  stats: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }[];
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
