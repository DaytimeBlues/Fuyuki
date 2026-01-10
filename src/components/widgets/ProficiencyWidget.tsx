import { Award } from 'lucide-react';

interface ProficiencyWidgetProps {
    profBonus: number;
    level: number;
}

export function ProficiencyWidget({ profBonus, level }: ProficiencyWidgetProps) {
    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Award size={18} className="text-white" />
                <h3 className="font-display text-sm text-parchment tracking-wider">PROFICIENCY BONUS</h3>
            </div>

            <div className="flex items-center justify-center">
                {/* Circular Display */}
                <div className="stat-circle">
                    <div className="text-center">
                        <span className="font-display text-3xl text-parchment-light">
                            +{profBonus}
                        </span>
                    </div>
                </div>
            </div>

            {/* Level Info */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
                <span className="text-xs text-muted">Character Level</span>
                <div className="font-display text-lg text-parchment-light mt-1">{level}</div>
            </div>
        </div>
    );
}
