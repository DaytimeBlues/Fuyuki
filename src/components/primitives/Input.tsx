import { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'text' | 'number';
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function Input({ variant = 'text', label, error, className, disabled, ...props }: InputProps) {
  const baseStyles = 'w-full bg-card-elevated border border-parchment-dark/40 rounded px-3 py-2 text-base focus:border-accent focus:outline-none transition-colors';
  
  const variantStyles = {
    text: 'text-text',
    number: 'font-mono text-center'
  }[variant];

  return (
    <div className="w-full">
      {label && (
        <label className="label-kyoto block mb-1">
          {label}
        </label>
      )}
      <input
        className={cn(baseStyles, variantStyles, error && 'border-vermillion focus:border-vermillion', disabled && 'opacity-50', className)}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-vermillion text-xs mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
