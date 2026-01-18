import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'column' | 'row';
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
  align?: 'start' | 'center' | 'end' | 'stretch';
  children: ReactNode;
}

const gapStyles = {
  1: 'gap-space-1',
  2: 'gap-space-2',
  3: 'gap-space-3',
  4: 'gap-space-4',
  6: 'gap-space-6',
  8: 'gap-space-8'
};

const alignStyles = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch'
};

const directionStyles = {
  column: 'flex-col',
  row: 'flex-row'
};

export function Stack({ direction = 'column', gap = 2, align = 'center', children, className, ...props }: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        directionStyles[direction],
        gapStyles[gap as keyof typeof gapStyles],
        alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
