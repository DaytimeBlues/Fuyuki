import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: number;
  gap?: 1 | 2 | 3 | 4 | 6;
  children: ReactNode;
}

const gapStyles = {
  1: 'gap-space-1',
  2: 'gap-space-2',
  3: 'gap-space-3',
  4: 'gap-space-4',
  6: 'gap-space-6'
};

const colStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  6: 'grid-cols-6',
  12: 'grid-cols-12'
};

export function Grid({ cols = 3, gap = 4, children, className, ...props }: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        colStyles[cols as keyof typeof colStyles] || `grid-cols-${cols}`,
        gapStyles[gap as keyof typeof gapStyles],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
