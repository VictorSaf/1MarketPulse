/**
 * SelectInput Component
 *
 * A styled select dropdown for settings.
 */

import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function SelectInput({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
}: SelectInputProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        className="w-full h-10 pl-3 pr-10 rounded-md bg-gray-700/50 border border-white/10 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} className="bg-gray-800" value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}
