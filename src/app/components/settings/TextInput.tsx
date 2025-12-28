/**
 * TextInput Component
 *
 * A styled text input for settings with optional show/hide for sensitive data.
 * SECURITY: When sensitive=true and not in edit mode, the actual value is NEVER
 * exposed in the DOM to prevent access via DevTools or XSS.
 */

import { useState, useEffect } from 'react';

import { Eye, EyeOff, Pencil, Check, X } from 'lucide-react';

import { Button } from '../ui/button';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password' | 'url' | 'email';
  placeholder?: string;
  disabled?: boolean;
  sensitive?: boolean;
  className?: string;
}

export function TextInput({
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  sensitive = false,
  className = '',
}: TextInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showValue, setShowValue] = useState(false);
  const [editValue, setEditValue] = useState('');

  // Reset edit state when value changes externally
  useEffect(() => {
    if (!isEditing) {
      setEditValue('');
    }
  }, [value, isEditing]);

  const maskValue = (val: string) => {
    if (!val) {return '';}
    if (val.length <= 8) {return '********';}
    return val.substring(0, 4) + '****' + val.substring(val.length - 4);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(value);
    setShowValue(false);
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
    setShowValue(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
    setShowValue(false);
  };

  // Non-sensitive input - simple behavior
  if (!sensitive) {
    return (
      <div className={`relative flex items-center gap-2 ${className}`}>
        <input
          className="flex-1 h-10 px-3 rounded-md bg-gray-700/50 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={disabled}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  // Sensitive input - edit mode
  if (isEditing) {
    return (
      <div className={`relative flex items-center gap-2 ${className}`}>
        <input
          autoFocus
          className="flex-1 h-10 px-3 rounded-md bg-gray-700/50 border border-blue-500/50 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder || 'Enter new value...'}
          type={showValue ? 'text' : 'password'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
        <Button
          className="flex-shrink-0"
          size="icon"
          title={showValue ? 'Hide value' : 'Show value'}
          variant="ghost"
          onClick={() => setShowValue(!showValue)}
        >
          {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button
          className="flex-shrink-0 text-green-400 hover:text-green-300"
          size="icon"
          title="Save"
          variant="ghost"
          onClick={handleSave}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          className="flex-shrink-0 text-red-400 hover:text-red-300"
          size="icon"
          title="Cancel"
          variant="ghost"
          onClick={handleCancel}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Sensitive input - display mode (value NEVER in DOM)
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-10 px-3 rounded-md bg-gray-700/50 border border-white/10 text-white text-sm flex items-center">
        <span className="text-gray-400 font-mono">
          {value ? maskValue(value) : <span className="text-gray-500 italic">Not set</span>}
        </span>
      </div>
      {!disabled && (
        <Button
          className="flex-shrink-0"
          size="icon"
          title="Edit value"
          variant="ghost"
          onClick={handleStartEdit}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
