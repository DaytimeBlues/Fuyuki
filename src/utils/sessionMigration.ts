import { Session, InventoryItem, EquipmentSlots } from '../types';
import { GRINDLETTE } from '../data/familiarsData';

export const CURRENT_MIGRATION_VERSION = 3; // Version after equipment & familiar migration

/**
 * Generates a unique ID for migration purposes.
 * Uses crypto.randomUUID() if available, falls back to timestamp.
 */
function generateItemId(index: number): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback: timestamp + index to ensure uniqueness
    return `item_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * One-time migration function to upgrade session data to V3 schema.
 * V3 adds:
 * - Equipment slots system
 * - Familiar support
 * - Inventory item IDs
 */
export function migrateSessionToV3(session: Session): Session {
    // Don't migrate if already at target version
    if (session.migrationVersion === CURRENT_MIGRATION_VERSION) {
        return session;
    }

    // Create a copy to avoid mutating original
    const migrated = { ...session, migrationVersion: CURRENT_MIGRATION_VERSION };

    // Step 1: Add IDs to inventory items (if missing)
    if (migrated.characterData.inventory) {
        migrated.characterData.inventory = migrated.characterData.inventory.map((item, index) => ({
            ...item,
            id: item.id ?? generateItemId(index),
        }));
    }

    // Step 2: Initialize empty equipment slots (if missing)
    if (!migrated.characterData.equipmentSlots) {
        migrated.characterData.equipmentSlots = {
            head: null,
            cloak: null,
            chest: null,
            hands: null,
            feet: null,
            ring1: null,
            ring2: null,
            amulet: null,
            mainHand: null,
            offHand: null,
        } satisfies EquipmentSlots;
    }

    // Step 3: Migrate existing equipped weapons to equipment slots
    const equippedWeapons = migrated.characterData.inventory.filter(
        (item: InventoryItem) => item.equipped && item.type === 'weapon'
    );

    if (equippedWeapons.length > 0 && migrated.characterData.equipmentSlots) {
        const equipmentSlots = migrated.characterData.equipmentSlots;
        // First equipped weapon goes to main hand
        const mainWeapon = equippedWeapons[0];
        if (mainWeapon.id) {
            equipmentSlots.mainHand = {
                itemId: mainWeapon.id,
                name: mainWeapon.name,
                cosmeticOnly: false,
                modifiers: [], // Initialize with empty modifiers
            };

            // Remove equipped flag from inventory item (state moved to equipmentSlots)
            mainWeapon.equipped = false;
        }

        // Second equipped weapon (if any) goes to off hand
        if (equippedWeapons[1]) {
            const offWeapon = equippedWeapons[1];
            if (offWeapon.id) {
                equipmentSlots.offHand = {
                    itemId: offWeapon.id,
                    name: offWeapon.name,
                    cosmeticOnly: false,
                    modifiers: [],
                };
                offWeapon.equipped = false;
            }
        }
    }

    // Step 4: Initialize familiar (optional - only if user has Pact of Chain)
    if (!migrated.characterData.familiar && shouldAutoAddGrindlette(migrated)) {
        migrated.characterData.familiar = { ...GRINDLETTE };
    }

    return migrated;
}

/**
 * Determines if Grindlette should be auto-added based on Pact of Chain.
 */
function shouldAutoAddGrindlette(session: Session): boolean {
    const pactBoon = session.characterData.pactBoon;
    return pactBoon?.type === 'chain' && !pactBoon?.familiar;
}

/**
 * Creates a backup of a session before migration.
 */
export function createSessionBackup(session: Session): void {
    const backupKey = `session_backup_${Date.now()}`;
    try {
        sessionStorage.setItem(backupKey, JSON.stringify(session));

        // Keep only last 5 backups
        const allKeys = Object.keys(sessionStorage);
        const backupKeys = allKeys
            .filter(k => k.startsWith('session_backup_'))
            .sort()
            .reverse()
            .slice(5); // Remove oldest backups

        backupKeys.forEach(key => sessionStorage.removeItem(key));
    } catch (error) {
        console.error('Failed to create session backup:', error);
    }
}

/**
 * Restores the latest backup.
 */
export function rollbackToLatestBackup(): Session | null {
    const allKeys = Object.keys(sessionStorage);
    const backupKeys = allKeys
        .filter(k => k.startsWith('session_backup_'))
        .sort()
        .reverse();

    if (backupKeys.length === 0) {
        return null;
    }

    const latestBackupKey = backupKeys[0];
    const backupData = sessionStorage.getItem(latestBackupKey);

    if (backupData) {
        try {
            const session = JSON.parse(backupData) as Session;
            // Restore as active session
            const activeKey = localStorage.getItem('fuyuki-active-session');
            if (activeKey) {
                localStorage.setItem(`session_restored_${Date.now()}`, backupData);
            }
            return session;
        } catch (error) {
            console.error('Failed to parse backup:', error);
            return null;
        }
    }

    return null;
}
