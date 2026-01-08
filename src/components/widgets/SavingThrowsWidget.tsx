import { Shield } from 'lucide-react';
import type { CharacterData } from '../../types';

interface SavingThrowsWidgetProps {
  data: CharacterData;
}

export function SavingThrowsWidget({ data }: SavingThrowsWidgetProps) {
  const { savingThrows } = data;

  return (
    <div className="card-parchment border border-white/15 rounded-lg p-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase tracking-widest text-white font-bold">
          Wards
        </h3>
        <Shield className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(savingThrows).map(([stat, val]) => (
            <div key={stat} className="flex flex-col items-center bg-white/5 rounded p-2 border border-white/10">
                <span className="text-[10px] uppercase text-muted tracking-wider">{stat}</span>
                <span className={`font-display text-lg ${val >= 0 ? 'text-white' : 'text-red-400'}`}>
                    {val >= 0 ? '+' : ''}{val}
                </span>
            </div>
        ))}
      </div>
    </div>
  );
}
