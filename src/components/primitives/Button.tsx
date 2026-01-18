import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }: ButtonProps) {
  const baseStyles = 'font-display text-sm uppercase tracking-wider font-semibold transition-all duration-200 relative overflow-hidden touch-action:manipulation';

  const variantStyles = {
    primary: 'bg-primary text-bg-dark border-white hover:bg-parchment-light shadow-accent-md',
    secondary: 'bg-card-elevated text-text border border-parchment-dark/40 hover:bg-parchment-dark',
    danger: 'bg-vermillion text-bg-dark border-vermillion-ink hover:shadow-accent-sm',
    ghost: 'bg-transparent text-accent border-accent/30 hover:bg-accent/10',
    gold: 'bg-gold-mid text-bg-dark border-gold-dim hover:shadow-accent-md'
  }[variant];

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs min-h-[38px]',
    md: 'px-4 py-2 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[52px]'
  }[size];

  return (
    <button
      className={cn(baseStyles, variantStyles, sizeStyles, disabled && 'opacity-50 cursor-not-allowed', className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block animate-spin-slow text-xl">↻</span>
      ) : (
        children
      )}
    </button>
  );
}
