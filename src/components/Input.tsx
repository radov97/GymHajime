'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, type ChangeEventHandler, type InputHTMLAttributes } from 'react';
import { InputType, type InputTypeValue } from '../lib/enums';
import IconButton from './IconButton';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  type?: InputTypeValue;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onDebouncedChange?: (value: string) => void;
  error?: boolean;
  errorText?: string;
  showToggle?: boolean;
  debounceDelay?: number;
  setIsTyping?: (isTyping: boolean) => void;
}

export default function Input({
  type = InputType.Text,
  value = '',
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
}: InputProps) {
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
      : 'border-[var(--color-brand)] bg-[var(--color-brand-soft)] focus:ring-[var(--color-brand)]';
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
          <IconButton
            icon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            label={showPassword ? 'Hide password' : 'Show password'}
            iconOnly
            variant="ghost"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 !p-1 text-gray-600 hover:!bg-transparent hover:text-black"
            disabled={disabled}
          />
        )}
      </div>
      {!disabled && error && errorText && <p className="mt-1 text-sm text-red-600">{errorText}</p>}
    </div>
  );
}
