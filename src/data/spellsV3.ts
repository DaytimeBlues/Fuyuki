import { SpellV3 } from '../schemas/spellSchema';
import { wizardSpellsV3, warlockSpellsV3 } from './srdSpellsV3';

// Re-export all wizard and warlock spells from SRD
export const initialSpellsV3: SpellV3[] = [...wizardSpellsV3, ...warlockSpellsV3].filter((spell, index, self) =>
    index === self.findIndex((t) => (t.id === spell.id))
);

