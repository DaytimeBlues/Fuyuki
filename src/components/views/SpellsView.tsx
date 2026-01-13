import React from 'react';
import { SpellList } from '../features/spells/SpellList';

const SpellsView: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-cinzel text-stone-100 mb-2">Spellbook</h1>
                <p className="text-stone-500 font-serif italic">
                    "Words of power, etched in blood and shadow."
                </p>
            </header>

            <SpellList />
        </div>
    );
};

export default SpellsView;
