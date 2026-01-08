import { Award } from 'lucide-react';
import type { CharacterData } from '../../types';

interface ProficiencyWidgetProps {
  data: CharacterData;
}

export function ProficiencyWidget({ data }: ProficiencyWidgetProps) {
  const { profBonus } = data;

  return (
    <div className="card-parchment border border-white/15 rounded-lg p-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-widest text-white font-bold">
          Mastery
        </h3>
        <Award className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      </div>
      
      <div className="flex items-center justify-center">
        <span className="text-3xl font-display text-white">
            +{profBonus}
        </span>
      </div>
    </div>
  );
}
