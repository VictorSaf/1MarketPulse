/**
 * SettingsSection Component
 *
 * A reusable wrapper for settings sections with consistent styling.
 */

import type { ReactNode } from 'react';

import { RotateCcw } from 'lucide-react';

import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

import type { LucideIcon } from 'lucide-react';

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  onReset?: () => void;
  resetLabel?: string;
}

export function SettingsSection({
  title,
  description,
  icon: Icon,
  iconColor = 'from-blue-500 to-purple-600',
  children,
  onReset,
  resetLabel = 'Reset to defaults',
}: SettingsSectionProps) {
  return (
    <Card className="bg-gray-800/50 border-white/10 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${iconColor} flex-shrink-0`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">{title}</CardTitle>
              <CardDescription className="text-gray-400 mt-1">{description}</CardDescription>
            </div>
          </div>
          {onReset && (
            <Button
              className="text-gray-400 hover:text-white"
              size="sm"
              variant="ghost"
              onClick={onReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {resetLabel}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

interface SettingsRowProps {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function SettingsRow({ label, description, children, className = '' }: SettingsRowProps) {
  return (
    <div className={`flex items-center justify-between py-4 border-b border-white/5 last:border-0 ${className}`}>
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-white font-medium">{label}</p>
        {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

interface SettingsGroupProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function SettingsGroup({ title, children, className = '' }: SettingsGroupProps) {
  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">{title}</h4>
      )}
      <div className="space-y-0">{children}</div>
    </div>
  );
}
