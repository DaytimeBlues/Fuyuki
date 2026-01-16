import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectCharacter, invocationToggled } from '../../store/slices/characterSlice';
import { PACT_BOONS } from '../../data/warlockData';
import { Book, Swords, Flame, Sparkles, Check } from 'lucide-react';

export function GrimoireView() {
    const character = useAppSelector(selectCharacter);
    const dispatch = useAppDispatch();
    const [activeSection, setActiveSection] = useState<'patron' | 'boon' | 'invocations'>('invocations');

    const handleToggleInvocation = (id: string) => {
        dispatch(invocationToggled(id));
    };

    return (
        <div className="pb-24 animate-fade-in">
            {/* Tab Header */}
            <div className="flex border-b border-white/5 mb-6 overflow-x-auto">
                <button
                    onClick={() => setActiveSection('patron')}
                    className={`px-4 py-2 font-kyoto text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeSection === 'patron' ? 'text-accent border-b border-accent' : 'text-muted'
                        }`}
                >
                    Patron
                </button>
                <button
                    onClick={() => setActiveSection('boon')}
                    className={`px-4 py-2 font-kyoto text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeSection === 'boon' ? 'text-accent border-b border-accent' : 'text-muted'
                        }`}
                >
                    Pact Boon
                </button>
                <button
                    onClick={() => setActiveSection('invocations')}
                    className={`px-4 py-2 font-kyoto text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeSection === 'invocations' ? 'text-accent border-b border-accent' : 'text-muted'
                        }`}
                >
                    Invocations
                </button>
            </div>

            {/* Patron Section */}
            {activeSection === 'patron' && (
                <div className="space-y-4 animate-slide-up">
                    <div className="card-parchment p-5 border-accent/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Flame size={20} className="text-accent" />
                            <h2 className="font-display text-xl text-parchment-light uppercase tracking-wider">
                                {character.patron.name}
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {character.patron.features.map((feature, i) => (
                                <div key={i} className="border-l border-accent/30 pl-4 py-1">
                                    <h4 className="text-sm font-kyoto text-accent uppercase mb-1">{feature}</h4>
                                    <p className="text-xs text-muted leading-relaxed">
                                        Empowered by your otherworldly pact, this feature provides unique abilities related to your patron's domain.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Boon Section */}
            {activeSection === 'boon' && (
                <div className="space-y-4 animate-slide-up">
                    <div className="card-parchment p-5 border-accent/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles size={20} className="text-accent" />
                            <h2 className="font-display text-xl text-parchment-light uppercase tracking-wider">
                                Pact of the {character.pactBoon.type}
                            </h2>
                        </div>
                        <div className="text-xs text-muted leading-relaxed mb-6">
                            {PACT_BOONS.find(b => b.id === character.pactBoon.type)?.description}
                        </div>

                        {character.pactBoon.type === 'blade' && character.pactBoon.pactWeapon && (
                            <div className="p-4 bg-bg-dark/40 rounded border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <Swords size={14} className="text-accent" />
                                    <span className="text-xs font-kyoto uppercase tracking-widest text-parchment-light">Pact weapon</span>
                                </div>
                                <div className="text-sm font-display text-white">{character.pactBoon.pactWeapon.name}</div>
                                <div className="text-[10px] text-muted uppercase tracking-tighter mt-1">Form: {character.pactBoon.pactWeapon.type}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Invocations Section */}
            {activeSection === 'invocations' && (
                <div className="space-y-3 animate-slide-up">
                    {character.invocations.map((inv) => (
                        <div key={inv.id} className="card-parchment overflow-hidden border-white/5">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-kyoto text-sm text-parchment-light uppercase tracking-widest">
                                        {inv.name}
                                    </h3>
                                    <p className="text-[10px] text-muted mt-1 leading-relaxed line-clamp-2">
                                        {inv.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleInvocation(inv.id)}
                                    className={`ml-4 w-10 h-10 rounded border flex items-center justify-center transition-all ${inv.active
                                            ? 'bg-accent border-accent text-bg-dark'
                                            : 'border-white/10 text-white/20 hover:border-white/30'
                                        }`}
                                >
                                    {inv.active ? <Check size={18} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-8 text-center px-6">
                        <Book className="text-accent/20 mx-auto mb-3" size={32} />
                        <p className="text-[10px] uppercase tracking-widest text-muted">
                            Ancient secrets whispered from the void.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

