'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { InputType } from '@/lib/enums';

export default function InputPalco({
  type = InputType.Text,
  value,
  onChange,
  onDebouncedChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = false,
  errorText = '',
  className = '',
  showToggle = false,
  debounceDelay = 1000,
  setIsTyping = () => {},
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!onDebouncedChange || !isDirty) return;

    const handler = setTimeout(() => {
      onDebouncedChange(localValue);
      setIsTyping(false);
    }, debounceDelay);

    return () => clearTimeout(handler);
  }, [localValue, onDebouncedChange, debounceDelay, isDirty, setIsTyping]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const isPassword = type === InputType.Password;
  const inputType =
    isPassword && showToggle ? (showPassword ? InputType.Text : InputType.Password) : type;

  const baseStyles =
    'w-full border p-2 rounded focus:outline-none transition-all duration-200 ease-in-out hover:brightness-110';
  const hoverStyles = !disabled ? 'hover:shadow-md hover:scale-[1.01]' : '';
  const disabledStyles = disabled ? 'opacity-60 bg-gray-100 cursor-not-allowed' : '';
  const errorStyles =
    !disabled && error
      ? 'border-red-500 bg-red-50 placeholder-red-400'
      : 'border-[var(--color-palco)] bg-[var(--color-palco-soft)] focus:ring-[var(--color-palco)]';
  const paddingRight = isPassword && showToggle ? 'pr-10' : '';

  const combinedClassNames = [
    baseStyles,
    hoverStyles,
    disabledStyles,
    errorStyles,
    paddingRight,
    className,
  ].join(' ');

  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          type={inputType}
          value={localValue}
          onChange={(e) => {
            if (!isDirty) setIsDirty(true);
            setLocalValue(e.target.value);
            setIsTyping(true);
            if (onChange) onChange(e);
          }}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={combinedClassNames}
          {...props}
        />
        {isPassword && showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer"
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {!disabled && error && errorText && <p className="mt-1 text-sm text-red-600">{errorText}</p>}
    </div>
  );
}
