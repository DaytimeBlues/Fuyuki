
import { InventoryItem, WeaponProperty, WeaponStats } from '../types';
import { Open5eWeapon, Open5eMagicItem, Open5eArmor } from '../services/SRDSearchService';
import { v4 as uuidv4 } from 'uuid';

export class ItemMapper {
    public static mapWeapon(w: Open5eWeapon): InventoryItem {
        const properties: WeaponProperty[] = [];
        if (w.properties) {
            w.properties.forEach(p => {
                const prop = p.toLowerCase();
                if (prop.includes('finesse')) properties.push('finesse');
                if (prop.includes('versatile')) properties.push('versatile');
                if (prop.includes('two-handed')) properties.push('two-handed');
                if (prop.includes('light')) properties.push('light');
                if (prop.includes('heavy')) properties.push('heavy');
                if (prop.includes('reach')) properties.push('reach');
                if (prop.includes('thrown')) properties.push('thrown');
                if (prop.includes('loading')) properties.push('loading');
                if (prop.includes('ammunition')) properties.push('ammunition');
                if (prop.includes('special')) properties.push('special');
            });
        }

        const weaponStats: WeaponStats = {
            damage: w.damage_dice || '1d4',
            damageType: w.damage_type?.toLowerCase() || 'bludgeoning',
            bonus: 0,
            properties: properties
        };

        // Extract versatile damage if present
        if (properties.includes('versatile')) {
            const versatileProp = w.properties?.find(p => p.toLowerCase().includes('versatile'));
            if (versatileProp) {
                const match = versatileProp.match(/\(([^)]+)\)/);
                if (match) {
                    weaponStats.versatileDamage = match[1];
                }
            }
        }

        return {
            id: uuidv4(),
            name: w.name,
            description: `Category: ${w.category}. Cost: ${w.cost}. Weight: ${w.weight}.`,
            type: 'weapon',
            equipped: false,
            weaponStats: weaponStats
        };
    }

    public static mapMagicItem(mi: Open5eMagicItem): InventoryItem {
        return {
            id: uuidv4(),
            name: mi.name,
            description: `${mi.type} (${mi.rarity}). ${mi.requires_attunement}\n\n${mi.desc}`,
            type: 'item',
            equipped: false
        };
    }

    public static mapArmor(a: Open5eArmor): InventoryItem {
        // Extract base AC from strings like "11 + Dex modifier" or "14"
        let baseAC = 10;
        const acMatch = a.ac_string.match(/^(\d+)/);
        if (acMatch) {
            baseAC = parseInt(acMatch[1], 10);
        }

        return {
            id: uuidv4(),
            name: a.name,
            description: `Category: ${a.category}. Cost: ${a.cost}. Weight: ${a.weight}. Strength Req: ${a.strength_requirement || 'None'}.`,
            type: 'armor',
            equipped: false,
            armorStats: {
                baseAC: baseAC,
                stealthDisadvantage: a.stealth_disadvantage
            }
        };
    }
}
