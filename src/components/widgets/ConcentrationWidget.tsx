import { Eye, X } from 'lucide-react';

interface ConcentrationWidgetProps {
    spell: string | null;
    suggestions?: string[];
    onClear: () => void;
    onSet: (spell: string) => void;
}

// Common concentration spells for quick selection
const CONCENTRATION_SPELLS = [
    'Bless', 'Hex', 'Hunter\'s Mark', 'Haste', 'Fly',
    'Invisibility', 'Hold Person', 'Animate Dead', 'Spirit Guardians'
];

export function ConcentrationWidget({ spell, suggestions = CONCENTRATION_SPELLS, onClear, onSet }: ConcentrationWidgetProps) {
    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Eye size={18} className={spell ? 'text-white' : 'text-muted'} />
                    <h3 className="font-display text-sm text-parchment tracking-wider">Concentration</h3>
                </div>
                {spell && (
                    <button
                        onClick={onClear}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        data-testid="concentration-clear-btn"
                    >
                        <X size={12} />
                        End
                    </button>
                )}
            </div>

            {spell ? (
                <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-sm text-white font-display" data-testid="concentration-spell">{spell}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <p className="text-xs text-muted">Not concentrating on any spell</p>
                    <div className="flex flex-wrap gap-1">
                        {suggestions.slice(0, 4).map(s => (
                            <button
                                key={s}
                                onClick={() => onSet(s)}
                                className="text-[10px] px-2 py-1 bg-card-elevated border border-white/10 rounded text-muted hover:text-white hover:border-white/30 transition-colors"
                                data-testid={`concentration-set-btn-${s.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {spell && (
                <p className="text-[10px] text-muted mt-2 opacity-60">
                    Taking damage requires CON save (DC 10 or ½ damage)
                </p>
            )}
        </div>
    );
}
