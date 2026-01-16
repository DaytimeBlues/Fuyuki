import { Zap } from 'lucide-react';

interface InitiativeWidgetProps {
    dexMod: number;
    profBonus?: number;
    jackOfAllTrades?: boolean;
}

export function InitiativeWidget({ dexMod, profBonus = 0, jackOfAllTrades = false }: InitiativeWidgetProps) {
    // Calculate initiative bonus
    const initiativeBonus = dexMod + (jackOfAllTrades ? Math.floor(profBonus / 2) : 0);

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-white" />
                <h3 className="font-display text-sm text-parchment tracking-wider">INITIATIVE</h3>
            </div>

            <div className="flex items-center justify-center">
                {/* Circular Display */}
                <div className="stat-circle">
                    <div className="text-center">
                        <span className="font-display text-3xl text-parchment-light" data-testid="initiative-result">
                            {initiativeBonus >= 0 ? '+' : ''}{initiativeBonus}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex justify-center mt-3">
                <button
                    className="btn-fantasy text-[10px] px-3 py-1"
                    data-testid="initiative-roll-btn"
                    onClick={() => console.log('Initiative Roll')}
                >
                    Roll Initiative
                </button>
            </div>

            {/* Breakdown */}
            <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">DEX Modifier</span>
                    <span className="text-parchment font-display">{dexMod >= 0 ? '+' : ''}{dexMod}</span>
                </div>
                {jackOfAllTrades && (
                    <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-muted">Jack of All Trades</span>
                        <span className="text-parchment font-display">+{Math.floor(profBonus / 2)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
