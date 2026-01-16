import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { Eye, X } from 'lucide-react';
import { selectConcentration, concentrationSet } from '../../store/slices/characterSlice';

export function ConcentrationFloatingBubble() {
    const dispatch = useAppDispatch();
    const activeConcentration = useAppSelector(selectConcentration);

    if (!activeConcentration) return null;

    return (
        <div className="fixed bottom-24 right-4 z-50 animate-fade-in-up">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative flex items-center gap-2 bg-gray-900 border border-white/20 rounded-full px-4 py-2 shadow-2xl">
                    <div className="relative">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                        <Eye size={16} className="text-blue-200 relative z-10" />
                    </div>

                    <span className="text-xs font-display text-blue-100 tracking-wide max-w-[100px] truncate">
                        {activeConcentration}
                    </span>

                    <button
                        onClick={() => dispatch(concentrationSet(null))}
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
