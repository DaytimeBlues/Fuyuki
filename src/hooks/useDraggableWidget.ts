import { useRef, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setWidgetPosition, WidgetPosition } from '../store/slices/widgetSlice';

type DragState = 'IDLE' | 'PENDING' | 'DRAG_READY' | 'DRAGGING';

interface UseDraggableWidgetOptions {
    id: string;
    longPressThreshold?: number; // ms, default 150 for touch
    edgeMargin?: number; // px, default 16
}

interface UseDraggableWidgetReturn {
    position: WidgetPosition;
    isDragging: boolean;
    bind: {
        onPointerDown: (e: React.PointerEvent) => void;
        onPointerMove: (e: React.PointerEvent) => void;
        onPointerUp: (e: React.PointerEvent) => void;
        onPointerCancel: (e: React.PointerEvent) => void;
        style: React.CSSProperties;
    };
}

export function useDraggableWidget(
    options: UseDraggableWidgetOptions
): UseDraggableWidgetReturn {
    const { id, longPressThreshold = 150, edgeMargin = 16 } = options;
    const dispatch = useAppDispatch();
    const savedPosition = useAppSelector((state) => state.widget.positions[id]);

    const [dragState, setDragState] = useState<DragState>('IDLE');
    const [dragPosition, setDragPosition] = useState<WidgetPosition | null>(null);

    const pendingTimer = useRef<number | null>(null);
    const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const frameRef = useRef<number | null>(null);

    const fallbackPosition: WidgetPosition = { x: 90, y: 75 };
    const basePosition = savedPosition ?? fallbackPosition;
    const currentPosition = dragPosition ?? basePosition;

    const clampPosition = useCallback(
        (x: number, y: number): WidgetPosition => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const marginPercent = {
                x: (edgeMargin / vw) * 100,
                y: (edgeMargin / vh) * 100,
            };
            return {
                x: Math.max(marginPercent.x, Math.min(100 - marginPercent.x, x)),
                y: Math.max(marginPercent.y, Math.min(100 - marginPercent.y, y)),
            };
        },
        [edgeMargin]
    );

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (dragState !== 'IDLE') return;

            // Capture pointer for consistent tracking
            (e.target as HTMLElement).setPointerCapture(e.pointerId);

            startPos.current = { x: e.clientX, y: e.clientY };

            if (e.pointerType === 'mouse') {
                // Mouse: immediate drag readiness
                setDragState('DRAG_READY');
            } else {
                // Touch: long-press threshold
                setDragState('PENDING');
                pendingTimer.current = window.setTimeout(() => {
                    setDragState('DRAG_READY');
                }, longPressThreshold);
            }
        },
        [dragState, longPressThreshold]
    );

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (dragState === 'IDLE' || dragState === 'PENDING') return;

            if (dragState === 'DRAG_READY') {
                // Check if movement threshold met
                const dx = Math.abs(e.clientX - startPos.current.x);
                const dy = Math.abs(e.clientY - startPos.current.y);
                if (dx > 5 || dy > 5) {
                    setDragState('DRAGGING');
                }
                return;
            }

            // DRAGGING state: update position using rAF
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }

            frameRef.current = requestAnimationFrame(() => {
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const newX = (e.clientX / vw) * 100;
                const newY = (e.clientY / vh) * 100;
                setDragPosition(clampPosition(newX, newY));
            });
        },
        [dragState, clampPosition]
    );

    const handlePointerUp = useCallback(
        (e: React.PointerEvent) => {
            // Clear pending timer
            if (pendingTimer.current) {
                clearTimeout(pendingTimer.current);
                pendingTimer.current = null;
            }

            // Cancel any pending frame
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }

            // Release pointer capture
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);

            // Save position if we were dragging
            if (dragState === 'DRAGGING') {
                dispatch(setWidgetPosition({ id, position: currentPosition }));
            }

            setDragPosition(null);
            setDragState('IDLE');
        },
        [dragState, currentPosition, dispatch, id]
    );

    const handlePointerCancel = useCallback(
        (e: React.PointerEvent) => {
            handlePointerUp(e);
        },
        [handlePointerUp]
    );

    const style: React.CSSProperties = {
        position: 'fixed',
        left: `${currentPosition.x}%`,
        top: `${currentPosition.y}%`,
        transform: `translate(-50%, -50%) ${dragState === 'DRAGGING' ? 'scale(1.1)' : 'scale(1)'}`,
        touchAction: 'none',
        userSelect: 'none',
        transition: dragState === 'DRAGGING' ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: dragState === 'DRAGGING' ? 9999 : 60,
        cursor: dragState === 'DRAGGING' ? 'grabbing' : 'grab',
    };

    return {
        position: currentPosition,
        isDragging: dragState === 'DRAGGING',
        bind: {
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerUp,
            onPointerCancel: handlePointerCancel,
            style,
        },
    };
}
