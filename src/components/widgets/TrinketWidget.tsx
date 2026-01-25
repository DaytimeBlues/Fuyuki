import { useState } from 'react';
import { Gift, RefreshCw } from 'lucide-react';
import { Card } from '../primitives/Card';
import { Button } from '../primitives/Button';
import { trinkets } from '../../data/trinkets';

export function TrinketWidget() {
    const [trinket, setTrinket] = useState<string | null>(null);
    const [isRolling, setIsRolling] = useState(false);

    const rollTrinket = () => {
        setIsRolling(true);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * trinkets.length);
            setTrinket(trinkets[randomIndex]);
            setIsRolling(false);
        }, 600);
    };

    return (
        <Card className="relative overflow-hidden bg-bg-void/40 border-stone-800 group h-full">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Gift size={16} className="text-accent" />
                        <h3 className="font-display text-[10px] text-muted uppercase tracking-[0.2em]">Trinket Roller</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={rollTrinket}
                        disabled={isRolling}
                        className="h-8 w-8 p-0 rounded-full hover:bg-accent/10"
                    >
                        <RefreshCw size={14} className={`text-accent ${isRolling ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    </Button>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center py-4 px-2 text-center">
                    {trinket ? (
                        <div className={`transition-all duration-500 ${isRolling ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                            <p className="text-sm text-parchment leading-relaxed font-body italic">
                                "{trinket}"
                            </p>
                        </div>
                    ) : (
                        <div className="text-stone-600 text-[10px] uppercase tracking-widest animate-pulse">
                            Ready to roll...
                        </div>
                    )}
                </div>

                {/* Decorative Japanese Text (Omizu/Water/Fluidity) */}
                <div className="absolute -bottom-2 -right-2 text-[3rem] font-japanese font-black text-white/[0.03] pointer-events-none select-none">
                    小物
                </div>
            </div>
        </Card>
    );
}
