import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('min-h-screen pb-space-12 md:pb-0', className)}>
      <main className="max-w-7xl mx-auto px-4 py-space-6">
        {children}
      </main>
    </div>
  );
}
