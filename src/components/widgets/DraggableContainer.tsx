import { ReactNode } from 'react';
import { useDraggableWidget } from '../../hooks/useDraggableWidget';
import { cn } from '../../utils/cn';

interface DraggableContainerProps {
    id: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function DraggableContainer({
    id,
    children,
    className,
    onClick,
}: DraggableContainerProps) {
    const { isDragging, bind } = useDraggableWidget({ id });

    const handleClick = (e: React.MouseEvent) => {
        // Only trigger click if not dragging
        if (!isDragging && onClick) {
            onClick();
        }
        e.stopPropagation();
    };

    return (
        <div
            {...bind}
            onClick={handleClick}
            className={cn(
                // Base sizing
                'w-14 h-14 rounded-2xl',
                // Glassmorphism
                'bg-black/40 backdrop-blur-xl border border-white/10',
                // Flex centering
                'flex items-center justify-center',
                // Shadow
                'shadow-xl',
                // Drag feedback
                isDragging && 'shadow-2xl shadow-accent/30 ring-2 ring-accent/50',
                className
            )}
        >
            {children}
        </div>
    );
}
