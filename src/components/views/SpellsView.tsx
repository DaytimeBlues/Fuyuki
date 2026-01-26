import { Suspense, memo } from 'react';
import { SpellList } from '../features/spells/SpellList';

const SpellsView = memo(function SpellsView() {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-24 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-4xl font-display text-parchment mb-2 tracking-[0.1em] uppercase">Spellbook</h1>
                <p className="text-parchment/80 font-serif italic">
                    "Words of power, etched in blood and shadow."
                </p>
            </header>

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center pt-20 animate-pulse">
                    <div className="w-12 h-12 border-2 border-gold-dim/20 border-t-gold-bright rounded-full animate-spin mb-4" />
                    <p className="text-parchment/70 font-display uppercase tracking-widest text-[10px]">Loading Spellbook...</p>
                </div>
            }>
                <SpellList />
            </Suspense>
        </div>
    );
});

export default SpellsView;
