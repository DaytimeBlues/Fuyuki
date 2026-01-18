import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, subtitle, children, className }: SectionProps) {
  return (
    <section className={cn('py-space-6 px-4 md:px-8 lg:px-12', className)}>
      {(title || subtitle) && (
        <div className="border-b border-parchment-dark/40 pb-space-4 mb-space-6">
          <div className="flex flex-col gap-1">
            {title && <h2 className="text-lg font-display font-bold text-text">{title}</h2>}
            {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}
