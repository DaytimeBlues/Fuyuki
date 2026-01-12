import type { Minion } from '../store/slices/combatSlice';

/**
 * Combatant interface for combat tracker.
 * Extends basic Minion type with additional combat-specific fields.
 */
export interface Combatant {
    id: string;
    name: string;
    type: 'player' | 'minion' | 'enemy';
    maxHp: number;
    currentHp: number;
    ac: number;
    initiative: number;
    conditions: string[];
}

export interface CombatState {
    round: number;
    turn: number;
    combatants: Combatant[];
    isActive: boolean;
    currentActorId?: string;
}

/**
 * Combat Engine
 * 
 * Manages combat state including initiative order, turn tracking,
 * damage/healing application, and round management.
 * 
 * SRD Reference:
 * - Combat (SRD 5.1, pp. 91-100)
 * - Initiative determines turn order (highest first)
 */
export class CombatEngine {
    private state: CombatState;

    constructor(initialState?: Partial<CombatState>) {
        this.state = {
            round: 1,
            turn: 0,
            combatants: [],
            isActive: false,
            currentActorId: undefined,
            ...initialState,
        };
    }

    /**
     * Start combat with a list of combatants.
     * Sorts by initiative (descending) and sets the first actor.
     */
    startCombat(combatants: Combatant[]): void {
        const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative);
        this.state = {
            round: 1,
            turn: 0,
            combatants: sorted,
            isActive: true,
            currentActorId: sorted[0]?.id,
        };
    }

    /**
     * Advance to the next turn.
     * Increments round when cycling back to the first combatant.
     */
    nextTurn(): void {
        if (!this.state.isActive || this.state.combatants.length === 0) return;

        const nextTurn = this.state.turn + 1;

        if (nextTurn >= this.state.combatants.length) {
            this.state.round++;
            this.state.turn = 0;
        } else {
            this.state.turn = nextTurn;
        }

        this.state.currentActorId = this.state.combatants[this.state.turn]?.id;
    }

    /**
     * Go back to the previous turn.
     */
    previousTurn(): void {
        if (!this.state.isActive) return;

        const prevTurn = this.state.turn - 1;

        if (prevTurn < 0) {
            if (this.state.round > 1) {
                this.state.round--;
                this.state.turn = this.state.combatants.length - 1;
            }
        } else {
            this.state.turn = prevTurn;
        }

        this.state.currentActorId = this.state.combatants[this.state.turn]?.id;
    }

    /**
     * Apply damage to a combatant.
     * HP cannot go below 0.
     */
    applyDamage(targetId: string, amount: number): void {
        const combatant = this.state.combatants.find(c => c.id === targetId);
        if (combatant) {
            combatant.currentHp = Math.max(0, combatant.currentHp - amount);
        }
    }

    /**
     * Apply healing to a combatant.
     * HP cannot exceed maxHp.
     */
    applyHealing(targetId: string, amount: number): void {
        const combatant = this.state.combatants.find(c => c.id === targetId);
        if (combatant) {
            combatant.currentHp = Math.min(combatant.maxHp, combatant.currentHp + amount);
        }
    }

    /**
     * Add a condition to a combatant.
     */
    addCondition(targetId: string, condition: string): void {
        const combatant = this.state.combatants.find(c => c.id === targetId);
        if (combatant && !combatant.conditions.includes(condition)) {
            combatant.conditions.push(condition);
        }
    }

    /**
     * Remove a condition from a combatant.
     */
    removeCondition(targetId: string, condition: string): void {
        const combatant = this.state.combatants.find(c => c.id === targetId);
        if (combatant) {
            combatant.conditions = combatant.conditions.filter(c => c !== condition);
        }
    }

    /**
     * Add a combatant to the fight (e.g., summoned creature).
     */
    addCombatant(combatant: Combatant): void {
        // Insert in initiative order
        const insertIndex = this.state.combatants.findIndex(
            c => c.initiative < combatant.initiative
        );

        if (insertIndex === -1) {
            this.state.combatants.push(combatant);
        } else {
            this.state.combatants.splice(insertIndex, 0, combatant);
        }
    }

    /**
     * Remove a combatant from the fight.
     */
    removeCombatant(id: string): void {
        const index = this.state.combatants.findIndex(c => c.id === id);
        if (index !== -1) {
            this.state.combatants.splice(index, 1);

            // Adjust turn if needed
            if (this.state.turn >= this.state.combatants.length) {
                this.state.turn = 0;
                this.state.round++;
            }

            this.state.currentActorId = this.state.combatants[this.state.turn]?.id;
        }
    }

    /**
     * End combat.
     */
    endCombat(): void {
        this.state.isActive = false;
    }

    /**
     * Get a copy of the current combat state.
     */
    getState(): CombatState {
        return { ...this.state, combatants: [...this.state.combatants] };
    }

    /**
     * Get the current actor.
     */
    getCurrentActor(): Combatant | undefined {
        return this.state.combatants.find(c => c.id === this.state.currentActorId);
    }

    /**
     * Check if a specific combatant's turn is active.
     */
    isActorTurn(id: string): boolean {
        return this.state.currentActorId === id;
    }
}

/**
 * Factory function to create a Combatant from a Redux Minion.
 */
export function minionToCombatant(minion: Minion, initiative: number): Combatant {
    return {
        id: minion.id,
        name: minion.name,
        type: 'minion',
        maxHp: minion.maxHp,
        currentHp: minion.hp,
        ac: minion.ac,
        initiative,
        conditions: [...minion.conditions],
    };
}
