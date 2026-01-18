import { CharacterEmbedding } from './characterEmbedding';

export interface SimulationResult {
    encounterId: string;
    damageDealt: number;
    damageTaken: number;
    resourcesConsumed: number; // Normalized cost (e.g. 1 spell slot = 1.0)
    roundsSurvived: number;
    victory: boolean;
}

/**
 * Defines the cost function J(theta) for build optimization.
 * This allows us to score a character build (embedding) against a set of simulation results.
 */
export interface ObjectiveFunction {
    // Weights for multi-objective optimization
    weights: {
        avgDamageDealt: number;      // Maximize (positive weight)
        avgDamageTaken: number;      // Minimize (negative weight)
        resourceEfficiency: number;   // Minimize cost per encounter (negative weight)
        versatility: number;          // Bonus for surviving diverse encounter types
    };

    /**
     * Evaluates a build's performance based on simulation results.
     * Returns a scalar score where higher is better.
     */
    evaluate(embedding: CharacterEmbedding, results: SimulationResult[]): number;
}

/**
 * A default balanced objective function implementation.
 * Prioritizes damage dealt and survival equally.
 */
export const BalancedObjective: ObjectiveFunction = {
    weights: {
        avgDamageDealt: 1.0,
        avgDamageTaken: -1.5, // Survival is slightly more critical
        resourceEfficiency: -0.5,
        versatility: 0.2
    },

    evaluate(_embedding: CharacterEmbedding, results: SimulationResult[]): number {
        if (results.length === 0) return 0;

        const totalDamage = results.reduce((sum, r) => sum + r.damageDealt, 0);
        const totalDamageTaken = results.reduce((sum, r) => sum + r.damageTaken, 0);
        const totalResources = results.reduce((sum, r) => sum + r.resourcesConsumed, 0);
        const winRate = results.filter(r => r.victory).length / results.length;

        const avgDamage = totalDamage / results.length;
        const avgTaken = totalDamageTaken / results.length;
        const avgResource = totalResources / results.length;

        // Simple linear combination
        let score = (avgDamage * this.weights.avgDamageDealt) +
            (avgTaken * this.weights.avgDamageTaken) +
            (avgResource * this.weights.resourceEfficiency);

        // Win rate is a hard multiplier - if you die, dps doesn't matter
        score *= (0.5 + 0.5 * winRate);

        return score;
    }
};
