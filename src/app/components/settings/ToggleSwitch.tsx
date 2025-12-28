/**
 * ToggleSwitch Component
 *
 * A styled toggle switch for boolean settings.
 */

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: { track: 'w-8 h-4', thumb: 'h-3 w-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'h-5 w-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'h-6 w-6', translate: 'translate-x-7' },
  };

  const { track, thumb, translate } = sizeClasses[size];

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        aria-label={label}
        checked={checked}
        className="sr-only peer"
        disabled={disabled}
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={`${track} bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:${translate} peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:${thumb} after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed`}
       />
      {label && <span className="ml-3 text-sm text-gray-300">{label}</span>}
    </label>
  );
}
