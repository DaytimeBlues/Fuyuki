import { CharacterData } from '../types';
import { INVOCATIONS, PACT_BOONS, PATRONS } from '../data/warlockData';

export interface RulesNode {
    id: string;
    type: 'patron' | 'pactBoon' | 'invocation' | 'spell' | 'feature';
    prerequisites: string[]; // IDs of required parent nodes
    incompatibleWith?: string[]; // Mutually exclusive options

    // Optional metadata for UI/Validation
    levelRequired?: number;
}

export interface ValidationResult {
    valid: boolean;
    reason?: string;
}

export interface RulesGraph {
    nodes: Map<string, RulesNode>;

    // Core API
    isChoiceValid(nodeId: string, currentState: CharacterData): boolean;
    getAvailableChoices(type: RulesNode['type'], currentState: CharacterData): string[];
    validateCharacter(state: CharacterData): ValidationResult;
}

/**
 * Creates the dependency graph for Warlock character building.
 * This models the relationships between Level, Patron, Pact Boon, and Invocations.
 */
export function createWarlockRulesGraph(): RulesGraph {
    const nodes = new Map<string, RulesNode>();

    // 1. Add Patrons (Roots)
    PATRONS.forEach(patron => {
        nodes.set(`patron:${patron.id}`, {
            id: `patron:${patron.id}`,
            type: 'patron',
            prerequisites: []
        });
    });

    // 2. Add Pact Boons (Level 3 Roots)
    PACT_BOONS.forEach(boon => {
        nodes.set(`pactBoon:${boon.id}`, {
            id: `pactBoon:${boon.id}`,
            type: 'pactBoon',
            prerequisites: [], // Level handled by check, strictly no *node* prereq except class level
            levelRequired: 3
        });
    });

    // 3. Add Invocations (The complex part)
    INVOCATIONS.forEach(inv => {
        const prereqs: string[] = [];

        // Handle Pact Boon prerequisites
        if (inv.pact) {
            prereqs.push(`pactBoon:${inv.pact}`);
        }

        // Handle specific spell/cantrip prerequisites (simplified mapping)
        // e.g., 'Eldritch Blast cantrip' -> we might need a 'spell:eldritch-blast' node
        // For this prototype, we'll map text prereqs to conceptual IDs if possible
        if (inv.prerequisites) {
            if (inv.prerequisites.includes('Eldritch Blast')) {
                // in a full system, this would point to a spell node. 
                // For now, we assume if you are a warlock, you likely have it or it's a soft check.
                // We will skip explicit node edge for spell prereqs in this v1 
                // unless we added spell nodes.
            }
        }

        nodes.set(`invocation:${inv.id}`, {
            id: `invocation:${inv.id}`,
            type: 'invocation',
            prerequisites: prereqs,
            levelRequired: inv.level
        });
    });

    return {
        nodes,

        isChoiceValid(nodeId: string, currentState: CharacterData): boolean {
            const node = nodes.get(nodeId);
            if (!node) {
                console.warn(`RulesGraph: Unknown node ${nodeId}`);
                return false;
            }

            // 1. Check Level
            if (node.levelRequired && currentState.level < node.levelRequired) {
                return false;
            }

            // 2. Check Prerequisites (Edges)
            if (node.prerequisites.length > 0) {
                for (const prereqId of node.prerequisites) {
                    const [type, id] = prereqId.split(':');

                    if (type === 'pactBoon') {
                        // Check if character has this pact boon
                        if (currentState.pactBoon?.type !== id) {
                            return false;
                        }
                    }

                    if (type === 'patron') {
                        if (currentState.patron?.name.toLowerCase().replace('the ', '') !== id) {
                            // This is loose matching because Patron in CharacterData is name-based currently
                            // Ideally refactor CharacterData to store patron ID
                            return false;
                        }
                    }
                }
            }

            // 3. Special Prereqs (Text based, mapped ad-hoc for v1)
            // e.g. Agonizing Blast requires Eldritch Blast
            if (node.id === 'invocation:agonizing-blast' || node.id === 'invocation:repelling-blast') {
                if (!currentState.cantripsKnown.some(c => c.toLowerCase().includes('eldritch blast'))) {
                    return false;
                }
            }

            return true;
        },

        getAvailableChoices(type: RulesNode['type'], currentState: CharacterData): string[] {
            const choices: string[] = [];
            for (const node of nodes.values()) {
                if (node.type === type && this.isChoiceValid(node.id, currentState)) {
                    choices.push(node.id);
                }
            }
            return choices;
        },

        validateCharacter(state: CharacterData): ValidationResult {
            // Validate all current invocations
            for (const inv of state.invocations) {
                if (inv.active) { // Only check active ones? Or all learned ones?
                    // Assuming 'invocations' list in CharacterData is "Known Invocations"
                    // But CharacterData structure shows `invocations: Invocation[]` where Invocation has `active: boolean`

                    if (!this.isChoiceValid(`invocation:${inv.id}`, state)) {
                        return { valid: false, reason: `Invalid Invocation: ${inv.name} prerequisites not met` };
                    }
                }
            }

            return { valid: true };
        }
    };
}
