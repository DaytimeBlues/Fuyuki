import { Archive, Settings, ChevronRight, Database } from 'lucide-react';
import { useState } from 'react';
import { SessionPicker } from '../SessionPicker';

interface MoreViewProps {
    onSelectView: (view: 'inventory' | 'settings' | 'patron') => void;
}

type AdminSection = 'sessions' | null;

export function MoreView({ onSelectView }: MoreViewProps) {
    const [adminSection, setAdminSection] = useState<AdminSection>(null);

    return (
        <div className="animate-fade-in space-y-4">
            <h2 className="font-kyoto uppercase text-lg text-parchment text-center mb-6">Menu</h2>

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

            {/* Admin Section - Session Management */}
            <div className="mt-8 border-t border-white/10 pt-6">
                <button
                    onClick={() => setAdminSection(adminSection === 'sessions' ? null : 'sessions')}
                    className="w-full card-parchment p-4 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-white/20"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
                            <Database size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <h3 className="font-display text-lg text-parchment group-hover:text-white transition-colors">Session Management</h3>
                            <p className="text-xs text-muted uppercase tracking-wide">Admin</p>
                        </div>
                        <ChevronRight className={`text-muted group-hover:text-white transition-colors ${adminSection === 'sessions' ? 'rotate-90' : ''}`} />
                    </div>
                </button>

                {adminSection === 'sessions' && (
                    <div className="mt-4 bg-card border border-white/10 rounded-xl p-4 animate-scale-in">
                        <SessionPicker
                            onSessionSelected={(session) => {
                                console.log('Admin: Selected session', session.id);
                                setAdminSection(null);
                            }}
                            onClose={() => setAdminSection(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

