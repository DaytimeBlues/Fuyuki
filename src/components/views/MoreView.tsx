import { Archive, Settings, ChevronRight } from 'lucide-react';

interface MoreViewProps {
    onSelectView: (view: 'inventory' | 'settings' | 'patron') => void;
}

export function MoreView({ onSelectView }: MoreViewProps) {
    return (
        <div className="animate-fade-in space-y-4">
            <h2 className="font-kyoto uppercase text-lg text-parchment tracking-[0.2em] text-center mb-6">Menu</h2>

            <div className="grid gap-3">
                <button
                    onClick={() => onSelectView('patron')}
                    className="card-parchment p-4 flex items-center justify-between group active:scale-[0.98] transition-all border border-gold-dim/20 bg-gradient-to-br from-bg-dark/80 to-bg-void"
                    data-testid="more-menu-item-patron"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold-mid/10 rounded-lg text-gold-mid group-hover:text-gold-bright group-hover:bg-gold-mid/20 transition-colors">
                            <span className="font-display font-bold text-lg">契</span>
                        </div>
                        <div className="text-left">
                            <h3 className="font-display text-lg text-parchment group-hover:text-white transition-colors">Pact Sworn</h3>
                            <p className="text-xs text-muted uppercase tracking-wide">Consult Patron</p>
                        </div>
                    </div>
                    <ChevronRight className="text-muted group-hover:text-accent transition-colors" />
                </button>

                <button
                    onClick={() => onSelectView('inventory')}
                    className="card-parchment p-4 flex items-center justify-between group active:scale-[0.98] transition-all"
                    data-testid="more-menu-item-inventory"
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
                    data-testid="more-menu-item-settings"
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
