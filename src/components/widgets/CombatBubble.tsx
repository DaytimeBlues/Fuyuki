import { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectSpellAttackBonus, selectSpellSaveDC, selectCurrentAC, selectCharacter } from '../../store/selectors';
import { Swords, Shield, Target, Zap, Swords as SwordsIcon } from 'lucide-react';
import { useDraggableWidget } from '../../hooks/useDraggableWidget';

export function CombatBubble() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isDragging, bind } = useDraggableWidget({ id: 'combat' });

    const character = useAppSelector(selectCharacter);
    const spellSaveDC = useAppSelector(selectSpellSaveDC);
    const spellAttackBonus = useAppSelector(selectSpellAttackBonus);
    const currentAC = useAppSelector(selectCurrentAC);

    const equippedWeapons = character.inventory.filter(item => item.type === 'weapon' && item.equipped);

    const handleClick = () => {
        if (!isDragging) {
            // On tap weapon, navigate to inventory/weapons view
            if (equippedWeapons.length > 0 && !isDragging) {
                // Find parent navigation function or emit event
                // For now, just expand the bubble
                setIsExpanded(!isExpanded);
            } else {
                setIsExpanded(!isExpanded);
            }
        }
    };

    // Auto-collapse after 8 seconds of inactivity if expanded
    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => setIsExpanded(false), 8000);
            return () => clearTimeout(timer);
        }
    }, [isExpanded]);

    return (
        <div
            {...bind}
            className={`flex flex-col items-end gap-3 pointer-events-none fixed bottom-24 right-4 z-50 ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
            {/* Sprouting Stats */}
            <div className={`flex flex-col gap-2 transition-all duration-500 origin-bottom pointer-events-auto ${isExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10 pointer-events-none'}`}>
                {/* AC Sprout */}
                <div className="flex items-center gap-3 bg-bg-dark/90 backdrop-blur-md border border-white/20 rounded-full pl-3 pr-4 py-2 shadow-2xl">
                    <Shield size={14} className="text-blue-400" />
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-tighter text-muted">Armor Class</span>
                        <span className="font-display text-base text-white leading-none">{currentAC}</span>
                    </div>
                </div>

                {/* DC Sprout */}
                <div className="flex items-center gap-3 bg-bg-dark/90 backdrop-blur-md border border-white/20 rounded-full pl-3 pr-4 py-2 shadow-2xl">
                    <Target size={14} className="text-purple-400" />
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-tighter text-muted">Spell DC</span>
                        <span className="font-display text-base text-white leading-none">{spellSaveDC}</span>
                    </div>
                </div>

                {/* Weapons Sprout */}
                {equippedWeapons.map((weapon, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-bg-dark/95 backdrop-blur-md border border-accent/40 rounded-full pl-3 pr-4 py-2 shadow-2xl ring-1 ring-accent/20">
                        <SwordsIcon size={14} className="text-accent" />
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-tighter text-accent/80">{weapon.name}</span>
                            <div className="flex items-baseline gap-2">
                                <span className="font-display text-sm text-white leading-none">
                                    {weapon.weaponStats?.damage}
                                </span>
                                <span className="text-[9px] text-muted italic">
                                    {weapon.weaponStats?.damageType}
                                </span>
                                <span className="text-[10px] text-accent font-bold">
                                    {spellAttackBonus >= 0 ? '+' : ''}{spellAttackBonus + (weapon.weaponStats?.bonus || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Concentration State */}
                {character.concentration && (
                    <div className="flex items-center gap-3 bg-accent/10 backdrop-blur-md border border-accent/60 rounded-full pl-3 pr-4 py-2 shadow-2xl animate-pulse">
                        <Zap size={14} className="text-accent" />
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-tighter text-accent">Concentrating</span>
                            <span className="font-display text-[10px] text-parchment truncate max-w-[80px]">
                                {character.concentration}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Core Bubble */}
            <button
                onClick={handleClick}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative pointer-events-auto
                    bg-black/40 backdrop-blur-md border border-white/10 shadow-xl
                    ${isExpanded
                        ? 'bg-accent text-bg-dark scale-90 rotate-45 shadow-accent-lg'
                        : 'text-white hover:border-white/40 hover:scale-105 active:scale-95'
                    }
                    ${isDragging ? 'scale-110 shadow-2xl shadow-accent/30 ring-2 ring-accent/50' : ''}
                `}
                aria-label={isExpanded ? 'Collapse combat quick stats' : 'Expand combat quick stats'}
                aria-expanded={isExpanded}
            >
                <Swords size={24} className={isExpanded ? '-rotate-45' : ''} />
            </button>
        </div>
    );
}
