
import weaponsData from '../data/open5e_weapons.json';
import magicItemsData from '../data/open5e_magicitems.json';
import armorData from '../data/open5e_armor.json';
import conditionsData from '../data/open5e_conditions.json';

export interface Open5eWeapon {
    name: string;
    slug: string;
    category: string;
    cost: string;
    damage_dice: string;
    damage_type: string;
    weight: string;
    properties: string[] | null;
    document__slug: string;
}

export interface Open5eMagicItem {
    name: string;
    slug: string;
    type: string;
    rarity: string;
    desc: string;
    requires_attunement: string;
    document__slug: string;
}

export interface Open5eArmor {
    name: string;
    slug: string;
    category: string;
    ac_string: string;
    strength_requirement: string | null;
    stealth_disadvantage: boolean;
    cost: string;
    weight: string;
    document__slug: string;
}

export interface Open5eCondition {
    name: string;
    slug: string;
    desc: string;
    document__slug: string;
}

export type SRDResult =
    | { type: 'weapon'; data: Open5eWeapon }
    | { type: 'magicitem'; data: Open5eMagicItem }
    | { type: 'armor'; data: Open5eArmor }
    | { type: 'condition'; data: Open5eCondition };

export class SRDSearchService {
    private static weapons = (weaponsData as any).results as Open5eWeapon[];
    private static magicItems = (magicItemsData as any).results as Open5eMagicItem[];
    private static armor = (armorData as any).results as Open5eArmor[];
    private static conditions = (conditionsData as any).results as Open5eCondition[];

    public static search(query: string): SRDResult[] {
        const q = query.toLowerCase();
        const results: SRDResult[] = [];

        // Search Weapons
        this.weapons.forEach(w => {
            if (w.name.toLowerCase().includes(q)) {
                results.push({ type: 'weapon', data: w });
            }
        });

        // Search Magic Items
        this.magicItems.forEach(mi => {
            if (mi.name.toLowerCase().includes(q)) {
                results.push({ type: 'magicitem', data: mi });
            }
        });

        // Search Armor
        this.armor.forEach(a => {
            if (a.name.toLowerCase().includes(q)) {
                results.push({ type: 'armor', data: a });
            }
        });

        // Conditions
        this.conditions.forEach(c => {
            if (c.name.toLowerCase().includes(q)) {
                results.push({ type: 'condition', data: c });
            }
        });

        return results.slice(0, 20); // Limit results for performance
    }

    public static getBySlug(slug: string, type: SRDResult['type']): SRDResult | null {
        switch (type) {
            case 'weapon':
                const w = this.weapons.find(i => i.slug === slug);
                return w ? { type: 'weapon', data: w } : null;
            case 'magicitem':
                const mi = this.magicItems.find(i => i.slug === slug);
                return mi ? { type: 'magicitem', data: mi } : null;
            case 'armor':
                const a = this.armor.find(i => i.slug === slug);
                return a ? { type: 'armor', data: a } : null;
            case 'condition':
                const c = this.conditions.find(i => i.slug === slug);
                return c ? { type: 'condition', data: c } : null;
            default:
                return null;
        }
    }
}
