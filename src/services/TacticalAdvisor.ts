import { RootState } from '../store/index';

export interface SpellCastEvent {
    spellName: string;
    level: number;
    timestamp: number;
    school?: string;
}

export interface TacticalRecommendation {
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    icon: '⚠️' | '💡' | '🔥' | '🛡️' | '⚡';
    action?: {
        type: 'cast' | 'rest' | 'heal' | 'condition';
        details: string;
    };
}

export class TacticalAdvisor {
    private static MAX_HISTORY = 10;
    private static spellHistory: SpellCastEvent[] = [];

    /**
     * Track a spell cast for tactical analysis
     */
    public static trackSpellCast(spellName: string, level: number, school?: string): void {
        const event: SpellCastEvent = {
            spellName,
            level,
            timestamp: Date.now(),
            school
        };

        this.spellHistory.unshift(event);
        if (this.spellHistory.length > this.MAX_HISTORY) {
            this.spellHistory = this.spellHistory.slice(0, this.MAX_HISTORY);
        }
    }

    /**
     * Analyze current state and provide tactical recommendations
     */
    public static analyze(state: RootState): TacticalRecommendation[] {
        const recommendations: TacticalRecommendation[] = [];

        // 1. Check HP levels
        const hp = state.health.hp;
        const hpPercent = hp.current / hp.max;

        if (hpPercent <= 0.25) {
            recommendations.push({
                priority: 'critical',
                title: 'Critical HP Warning',
                description: `${hp.current}/${hp.max} HP. Immediate healing or retreat recommended.`,
                icon: '⚠️',
                action: {
                    type: 'heal',
                    details: 'Use healing potions, spells, or rest immediately.'
                }
            });
        } else if (hpPercent <= 0.5) {
            recommendations.push({
                priority: 'high',
                title: 'HP Low',
                description: `${hp.current}/${hp.max} HP. Consider healing or defensive tactics.`,
                icon: '⚠️'
            });
        }

        // 2. Check temporary HP
        if (hp.temp > 0 && hpPercent <= 0.75) {
            recommendations.push({
                priority: 'medium',
                title: 'Temp HP Active',
                description: `${hp.temp} temporary HP. Good time to be aggressive.`,
                icon: '🛡️',
                action: {
                    type: 'cast',
                    details: 'Use damage spells while temp HP buffer lasts.'
                }
            });
        }

        // 3. Check spell slot exhaustion
        const slots = state.spellbook.availableSlots;
        const maxSlots = state.spellbook.maxSlots;
        const lowLevels: number[] = [];

        Object.keys(slots).forEach((levelStr) => {
            const level = parseInt(levelStr, 10);
            const available = slots[level] || 0;
            const max = maxSlots[level] || 0;
            const ratio = available / max;

            if (ratio <= 0.25 && max > 0) {
                lowLevels.push(level);
            }
        });

        if (lowLevels.length > 0) {
            recommendations.push({
                priority: 'high',
                title: 'Spell Slots Depleted',
                description: `Level ${lowLevels.join(', ')} slots nearly empty (${lowLevels.map(l => slots[l]).join('/')}/${lowLevels.map(l => maxSlots[l]).join('/')}).`,
                icon: '⚡',
                action: {
                    type: 'rest',
                    details: 'Consider short rest if pact slots available, or long rest for full recovery.'
                }
            });
        }

        // 4. Check concentration status
        if (state.health.concentration && hpPercent <= 0.5) {
            recommendations.push({
                priority: 'high',
                title: 'Concentration at Risk',
                description: `Maintaining ${state.health.concentration} while HP is critical.`,
                icon: '⚠️',
                action: {
                    type: 'condition',
                    details: 'Be ready to break concentration to protect yourself, or retreat.'
                }
            });
        }

        // 5. Analyze spell casting patterns
        if (this.spellHistory.length >= 3) {
            const recentCasts = this.spellHistory.slice(0, 5);
            const damageCasts = recentCasts.filter(e =>
                ['Evocation', 'Necromancy'].includes(e.school || '')
            );

            if (damageCasts.length >= 3) {
                recommendations.push({
                    priority: 'medium',
                    title: 'Aggressive Casting Pattern',
                    description: `${damageCasts.length} damage spells cast recently. Consider control or utility.`,
                    icon: '💡'
                });
            }
        }

        // 6. Check for available higher-level slots
        const highLevelSlots = [4, 5, 6, 7, 8, 9].filter(
            l => slots[l] && slots[l] > 0
        );

        if (highLevelSlots.length > 0 && hpPercent > 0.75) {
            recommendations.push({
                priority: 'low',
                title: 'High-Level Slots Available',
                description: `Level ${highLevelSlots.join(', ')} slots ready. Consider powerful spells.`,
                icon: '🔥'
            });
        }

        return recommendations.sort((a, b) => {
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    /**
     * Clear spell history (useful for new combat scenarios)
     */
    public static clearHistory(): void {
        this.spellHistory = [];
    }

    /**
     * Get recent cast history
     */
    public static getHistory(): SpellCastEvent[] {
        return [...this.spellHistory];
    }
}
