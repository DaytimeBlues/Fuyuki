import { Dices } from 'lucide-react';
import type { CharacterData } from '../../types';

interface HitDiceWidgetProps {
  data: CharacterData;
}

export function HitDiceWidget({ data }: HitDiceWidgetProps) {
  const { current, max, dieType } = data.hitDice;

  return (
    <div className="card-parchment border border-white/15 rounded-lg p-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-widest text-white font-bold">
          Vitality Dice
        </h3>
        <Dices className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      </div>
      
      {/* Content */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl font-display text-white">{current}</span>
        <span className="text-muted text-sm uppercase">/ {max}</span>
        <span className="text-muted text-xs ml-1">(d{dieType})</span>
      </div>
    </div>
  );
}
