import { SpellV3 } from '../schemas/spellSchema';
import { wizardSpellsV3 } from './srdSpellsV3';

// Re-export all wizard spells from SRD
// This replaces the previous hardcoded 6 spells with the full SRD wizard spell list
export const initialSpellsV3: SpellV3[] = wizardSpellsV3;

