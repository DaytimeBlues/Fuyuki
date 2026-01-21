import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Eye, X } from 'lucide-react';
import { selectConcentration } from '../../store/selectors';
import { concentrationSet } from '../../store/slices/healthSlice';
import { useDraggableWidget } from '../../hooks/useDraggableWidget';

export function ConcentrationFloatingBubble() {
    const dispatch = useAppDispatch();
    const activeConcentration = useAppSelector(selectConcentration);
    const { isDragging, bind } = useDraggableWidget({ id: 'concentration' });

    if (!activeConcentration) return null;

    const handleClear = () => {
        if (!isDragging) {
            dispatch(concentrationSet(null));
        }
    };

    return (
        <div
            {...bind}
            className="flex items-center gap-2 pointer-events-auto"
        >
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className={`relative flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 shadow-2xl
                    ${isDragging ? 'scale-110 ring-2 ring-accent/50' : ''}
                `}>
                    <div className="relative">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                        <Eye size={16} className="text-blue-200 relative z-10" />
                    </div>

                    <span className="text-xs font-display text-blue-100 tracking-wide max-w-[100px] truncate">
                        {activeConcentration}
                    </span>

                    <button
                        onClick={handleClear}
                        className="ml-1 p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                        aria-label="Break concentration"
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
}
