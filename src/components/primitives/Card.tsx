import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'parchment' | 'elevated' | 'glass' | 'void';
  interactive?: boolean;
  children: ReactNode;
}

export function Card({ variant = 'parchment', interactive = false, className, children, ...props }: CardProps) {
  const baseStyles = 'relative overflow-hidden';

  const variantStyles = {
    parchment: 'card-parchment',
    elevated: 'card-parchment shadow-elevation-lg',
    glass: 'glass-card',
    void: 'bg-bg'
  }[variant];

  const interactiveStyles = interactive ? 'hover:transform hover:-translate-y-[-2px] transition-transform duration-200' : '';

  return (
    <div className={cn(baseStyles, variantStyles, interactiveStyles, className)} {...props}>
      {children}
    </div>
  );
}
