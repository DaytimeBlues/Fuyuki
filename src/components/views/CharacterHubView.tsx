import { useState } from 'react';
import { User, Brain, BookOpen } from 'lucide-react';
import { BiographyView } from './BiographyView';
import { StatsView } from './StatsView';
import { GrimoireView } from './GrimoireView';
import { AttunementWidget } from '../widgets/AttunementWidget';

import { CharacterData } from '../../types';

interface CharacterHubViewProps {
    character: CharacterData;
    handleCastFromInventory?: (spellName: string) => void;
    actions: {
        itemAttuned: (itemName: string) => void;
        itemUnattuned: (index: number) => void;
        conditionRemoved: (condition: string) => void;
    };
}

type SubTab = 'bio' | 'stats' | 'arcana';

export function CharacterHubView({ character, actions }: CharacterHubViewProps) {
    const [subTab, setSubTab] = useState<SubTab>('bio');

    const tabs: { id: SubTab, label: string, icon: React.ComponentType<{ size?: number | string }> }[] = [
        { id: 'bio', label: 'Biography', icon: User },
        { id: 'stats', label: 'Attributes', icon: Brain },
        { id: 'arcana', label: 'Grimoire', icon: BookOpen },
    ];

    return (
        <div className="animate-fade-in pb-20">
            {/* Sub Navigation */}
            <div className="flex p-1 bg-white/5 rounded-lg mb-6 mx-2 border border-white/10">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setSubTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-xs uppercase tracking-wider font-display ${subTab === tab.id
                            ? 'bg-card-elevated text-parchment shadow-sm border border-white/10'
                            : 'text-muted hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="animate-slide-up">
                {subTab === 'bio' && (
                    <div className="space-y-6">
                        <BiographyView />
                        <AttunementWidget
                            items={character.attunement}
                            onAdd={(item) => actions.itemAttuned(item)}
                            onRemove={(index) => actions.itemUnattuned(index)}
                        />
                    </div>
                )}

                {subTab === 'stats' && (
                    <StatsView
                        abilities={character.abilities}
                        abilityMods={character.abilityMods}
                        skills={character.skills}
                        profBonus={character.profBonus}
                        level={character.level}
                        conditions={character.conditions || []}
                        onRemoveCondition={actions.conditionRemoved}
                    />
                )}

                {subTab === 'arcana' && (
                    <GrimoireView />
                )}
            </div>
        </div>
    );
}
