import { Heart, Skull } from 'lucide-react';

interface DeathSavesWidgetProps {
    successes: number;
    failures: number;
    onChange: (type: 'successes' | 'failures', value: number) => void;
}

export function DeathSavesWidget({ successes, failures, onChange }: DeathSavesWidgetProps) {
    return (
        <div className="card-parchment p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Skull size={18} className="text-muted" />
                <h3 className="font-display text-sm text-parchment tracking-wider">Death Saves</h3>
            </div>

            <div className="flex justify-between gap-6">
                {/* Successes */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3" data-testid="death-successes">
                        <Heart size={14} className="text-white" />
                        <span className="text-xs text-white uppercase tracking-wider">Success</span>
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <button
                                key={i}
                                onClick={() => onChange('successes', i === successes ? i - 1 : i)}
                                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${i <= successes
                                    ? 'bg-white border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                                    : 'bg-transparent border-white/30 hover:border-white/50'
                                    }`}
                                data-testid={`death-success-${i - 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="w-px bg-white/10" />

                {/* Failures */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3" data-testid="death-failures">
                        <Skull size={14} className="text-red-400" />
                        <span className="text-xs text-red-400 uppercase tracking-wider">Failure</span>
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <button
                                key={i}
                                onClick={() => onChange('failures', i === failures ? i - 1 : i)}
                                className={`w-7 h-7 rounded-full border-2 transition-all duration-200 ${i <= failures
                                    ? 'bg-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                    : 'bg-transparent border-white/30 hover:border-red-500/50'
                                    }`}
                                data-testid={`death-failure-${i - 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
