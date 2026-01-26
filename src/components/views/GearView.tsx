import { useState, lazy, Suspense } from 'react';
import { Shield, Swords } from 'lucide-react';

const ArmorView = lazy(() => import('./ArmorView').then(m => ({ default: m.ArmorView })));
const WeaponsView = lazy(() => import('./WeaponsView').then(m => ({ default: m.WeaponsView })));

type GearTab = 'armor' | 'weapons';

export function GearView() {
    const [activeTab, setActiveTab] = useState<GearTab>('armor');

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            {/* Header / Tab Switcher */}
            <div className="flex items-center justify-between p-1 bg-bg-dark/60 rounded-xl border border-white/5 max-w-sm mx-auto">
                <button
                    onClick={() => setActiveTab('armor')}
                    className={`
                        flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300
                        ${activeTab === 'armor'
                            ? 'bg-gold-bright text-bg-dark font-bold shadow-accent-md'
                            : 'text-muted hover:bg-white/5'}
                    `}
                >
                    <Shield size={18} />
                    <span className="font-display uppercase tracking-widest text-xs">Armor</span>
                </button>
                <button
                    onClick={() => setActiveTab('weapons')}
                    className={`
                        flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300
                        ${activeTab === 'weapons'
                            ? 'bg-gold-bright text-bg-dark font-bold shadow-accent-md'
                            : 'text-muted hover:bg-white/5'}
                    `}
                >
                    <Swords size={18} />
                    <span className="font-display uppercase tracking-widest text-xs">Weapons</span>
                </button>
            </div>

            {/* View Container */}
            <div className="relative min-h-[500px]">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center pt-20 animate-pulse">
                        <div className="w-12 h-12 border-2 border-gold-dim/20 border-t-gold-bright rounded-full animate-spin mb-4" />
                        <p className="text-muted font-display uppercase tracking-widest text-[10px]">Loading Armory...</p>
                    </div>
                }>
                    {activeTab === 'armor' ? <ArmorView /> : <WeaponsView />}
                </Suspense>
            </div>
        </div>
    );
}
