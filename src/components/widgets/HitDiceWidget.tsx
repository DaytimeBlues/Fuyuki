import { Dices } from 'lucide-react';

interface HitDiceWidgetProps {
    total: number;
    used: number;
    dieType: number;
    conMod: number;
    onChange: (used: number) => void;
}

export function HitDiceWidget({ total, used, dieType, conMod, onChange }: HitDiceWidgetProps) {
    const remaining = total - used;

    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Dices size={18} className="text-white" />
                <h3 className="font-display text-sm text-parchment tracking-wider">HIT DICE</h3>
            </div>

            <div className="flex items-center gap-6">
                {/* Circular Display */}
                <div className="stat-circle">
                    <div className="text-center">
                        <span className="font-display text-2xl text-parchment-light">{remaining}</span>
                        <span className="text-muted text-sm">/{total}</span>
                    </div>
                </div>

                {/* Dice Info and Controls */}
                <div className="flex-1">
                    {/* Die Type Display */}
                    <div className="mb-3 text-center">
                        <span className="text-xs text-muted">Die Type</span>
                        <div className="font-display text-lg text-parchment-light">d{dieType}</div>
                        <span className="text-[10px] text-muted">+{conMod} CON</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => onChange(Math.min(total, used + 1))}
                            disabled={used >= total}
                            className="btn-fantasy flex-1 text-xs py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Use
                        </button>
                        <button
                            onClick={() => onChange(Math.max(0, used - 1))}
                            disabled={used === 0}
                            className="btn-fantasy flex-1 text-xs py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            Restore
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Footer */}
            <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-[10px] text-muted opacity-60">
                    Roll during short rest • Regain all on long rest
                </p>
            </div>
        </div>
    );
}
