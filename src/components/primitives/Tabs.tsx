import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}

export function Tabs({ defaultValue, value, onValueChange, children, className, ...props }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('w-full', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function Tab({ value, children, icon, className, ...props }: TabProps) {
  return (
    <button
      role="tab"
      aria-selected={value === undefined}
      className={cn(
        'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-t rounded-t border-b-2 transition-all duration-200',
        'text-stone-400 hover:text-gold-bid',
        'data-[state=active]:text-accent data-[state=active]:border-accent data-[state=active]:bg-gold-bid/10',
        className
      )}
      {...props}
    >
      {icon && <span className="text-sm">{icon}</span>}
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
}
