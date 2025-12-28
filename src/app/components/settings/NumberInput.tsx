/**
 * NumberInput Component
 *
 * A styled number input with increment/decrement buttons.
 */

import { Minus, Plus } from 'lucide-react';

import { Button } from '../ui/button';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  suffix?: string;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999999,
  step = 1,
  disabled = false,
  suffix,
  className = '',
}: NumberInputProps) {
  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        className="h-8 w-8 text-gray-400 hover:text-white"
        disabled={disabled || value <= min}
        size="icon"
        variant="ghost"
        onClick={handleDecrement}
      >
        <Minus className="w-4 h-4" />
      </Button>

      <div className="relative">
        <input
          className="w-24 h-8 px-3 text-center rounded-md bg-gray-700/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          disabled={disabled}
          max={max}
          min={min}
          step={step}
          type="number"
          value={value}
          onChange={handleInputChange}
        />
        {suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {suffix}
          </span>
        )}
      </div>

      <Button
        className="h-8 w-8 text-gray-400 hover:text-white"
        disabled={disabled || value >= max}
        size="icon"
        variant="ghost"
        onClick={handleIncrement}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
