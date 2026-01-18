import { HTMLAttributes, useEffect, useState, useMemo } from 'react';
import { cn } from '../../utils/cn';


export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'info';
  title?: string;
  duration?: number;
}

export function Toast({ variant = 'info', title, duration = 2000, className, ...props }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration]);

  const variantStyles = useMemo(() => ({
    success: 'border-l-4 bg-moss/10 border-l-2 text-moss',
    error: 'border-l-4 bg-vermillion/10 border-l-2 text-vermillion',
    info: 'border-l-4 bg-indigo/10 border-l-2 text-indigo'
  }[variant]), [variant]);

  const variantIcon = useMemo(() => ({
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }[variant]), [variant]);

  return (
    <div
      role="alert"
      className={cn(
        'fixed top-4 right-4 z-50 p-4 rounded shadow-accent-lg animate-fade-in',
        variantStyles,
        !visible && 'opacity-0 pointer-events-none translate-x-full',
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">{variantIcon}</span>
        <div className="flex-1">
          {title && <p className="font-semibold text-base mb-1">{title}</p>}
          <div className="text-sm opacity-80">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
