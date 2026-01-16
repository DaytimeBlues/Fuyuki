import { Archive, Settings, ChevronRight } from 'lucide-react';

interface MoreViewProps {
    onSelectView: (view: 'inventory' | 'settings') => void;
}

export function MoreView({ onSelectView }: MoreViewProps) {
    return (
        <div className="animate-fade-in space-y-4">
            <h2 className="font-kyoto uppercase text-lg text-parchment tracking-[0.2em] text-center mb-6">Menu</h2>

            <div className="grid gap-3">
                <button
                    onClick={() => onSelectView('inventory')}
                    className="card-parchment p-4 flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-lg text-parchment group-hover:text-accent group-hover:bg-white/10 transition-colors">
                            <Archive size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-display text-lg text-parchment group-hover:text-white transition-colors">Inventory</h3>
                            <p className="text-xs text-muted uppercase tracking-wide">Manage Items & Equipment</p>
                        </div>
                    </div>
                    <ChevronRight className="text-muted group-hover:text-accent transition-colors" />
                </button>

                <button
                    onClick={() => onSelectView('settings')}
                    className="card-parchment p-4 flex items-center justify-between group active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-lg text-parchment group-hover:text-accent group-hover:bg-white/10 transition-colors">
                            <Settings size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-display text-lg text-parchment group-hover:text-white transition-colors">Settings</h3>
                            <p className="text-xs text-muted uppercase tracking-wide">Character Data & Rules</p>
                        </div>
                    </div>
                    <ChevronRight className="text-muted group-hover:text-accent transition-colors" />
                </button>
            </div>
        </div>
    );
}
