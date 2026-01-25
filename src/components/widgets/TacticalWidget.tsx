import { useMemo, useState } from 'react';
import { AlertTriangle, Lightbulb, Shield, Zap, Flame } from 'lucide-react';
import { Card } from '../primitives/Card';
import { Button } from '../primitives/Button';
import { useAppSelector } from '../../store/hooks';
import { TacticalAdvisor, TacticalRecommendation } from '../../services/TacticalAdvisor';
import { RootState } from '../../store/index';

const getPriorityColor = (priority: TacticalRecommendation['priority']): string => {
    switch (priority) {
        case 'critical':
            return 'bg-red-500/10 text-red-400 border-red-500/30';
        case 'high':
            return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
        case 'medium':
            return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        case 'low':
            return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        default:
            return 'bg-stone-800/10 text-stone-400 border-stone-700/30';
    }
};

const getPriorityBorderColor = (priority: TacticalRecommendation['priority']): string => {
    switch (priority) {
        case 'critical':
            return 'border-red-500';
        case 'high':
            return 'border-orange-500';
        case 'medium':
            return 'border-yellow-500';
        case 'low':
            return 'border-blue-500';
        default:
            return 'border-stone-700';
    }
};

const getIcon = (icon: TacticalRecommendation['icon']) => {
    switch (icon) {
        case '⚠️':
            return <AlertTriangle size={14} className="text-red-400" />;
        case '💡':
            return <Lightbulb size={14} className="text-yellow-400" />;
        case '🔥':
            return <Flame size={14} className="text-orange-400" />;
        case '🛡️':
            return <Shield size={14} className="text-blue-400" />;
        case '⚡':
            return <Zap size={14} className="text-yellow-400" />;
        default:
            return <AlertTriangle size={14} />;
    }
};

export function TacticalWidget() {
    const state = useAppSelector((state: RootState) => state);
    const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());

    const recommendations = useMemo(() => {
        return TacticalAdvisor.analyze(state);
    }, [state]);

    const visibleRecommendations = useMemo(() => {
        return recommendations.filter(
            (_rec, index) => !dismissedIds.has(index)
        );
    }, [recommendations, dismissedIds]);

    const handleDismiss = (index: number) => {
        setDismissedIds(prev => new Set([...prev, index]));
    };

    const handleClearHistory = () => {
        TacticalAdvisor.clearHistory();
        setDismissedIds(new Set());
    };

    if (visibleRecommendations.length === 0) {
        return (
            <Card className="h-full bg-bg-void/40 border-stone-800 p-4">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-4xl mb-2 opacity-50">🎯</div>
                    <h3 className="font-display text-[10px] text-muted uppercase tracking-[0.2em] mb-2">
                        No Recommendations
                    </h3>
                    <p className="text-xs text-parchment/60 leading-relaxed">
                        Combat is proceeding smoothly. No tactical concerns detected.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="h-full bg-bg-void/40 border-stone-800 overflow-hidden">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 px-4 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="text-lg">🎯</div>
                        <h3 className="font-display text-[10px] text-muted uppercase tracking-[0.2em]">
                            Tactical Advisor
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearHistory}
                        className="h-6 w-6 p-0 text-parchment/40 hover:text-accent"
                    >
                        ×
                    </Button>
                </div>

                {/* Recommendations List */}
                <div className="flex-1 overflow-y-auto space-y-2 px-4 pb-4 scrollbar-custom">
                    {visibleRecommendations.map((rec, idx) => (
                        <div
                            key={`${rec.priority}-${idx}`}
                            className={`relative p-3 rounded-lg border-l-4 transition-all ${getPriorityBorderColor(rec.priority)} hover:bg-bg-dark/20 animate-fade-in stagger-${Math.min(idx + 1, 5)}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {getIcon(rec.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className={`font-display text-xs font-semibold tracking-wide ${getPriorityColor(rec.priority)} whitespace-nowrap`}>
                                            {rec.title}
                                        </h4>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(rec.priority)} bg-opacity-20`}>
                                            {rec.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-parchment/80 leading-relaxed">
                                        {rec.description}
                                    </p>
                                    {rec.action && (
                                        <div className="mt-2 pt-2 border-t border-stone-700/30">
                                            <p className="text-[10px] text-muted italic">
                                                Action: {rec.action.details}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDismiss(idx)}
                                    className="h-6 w-6 p-0 flex-shrink-0 text-parchment/40 hover:text-accent"
                                >
                                    ×
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative Japanese Text */}
                <div className="absolute -bottom-2 -right-2 text-[3rem] font-japanese font-black text-white/[0.03] pointer-events-none select-none">
                    戦術
                </div>
            </div>
        </Card>
    );
}
