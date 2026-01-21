import { Session } from '../types';

export interface MigrationValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Validates that a session is safe to migrate.
 */
export function validateSessionForMigration(session: Session): MigrationValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check 1: Session has required fields
    if (!session.characterData) {
        errors.push('Session missing characterData');
        return { isValid: false, errors, warnings };
    }

    // Check 2: Inventory exists (even if empty)
    if (!Array.isArray(session.characterData.inventory)) {
        errors.push('Session inventory is not an array');
    }

    // Check 3: No malformed inventory items
    if (session.characterData?.inventory) {
        session.characterData.inventory.forEach((item, idx) => {
            if (!item.name) {
                errors.push(`Inventory item at index ${idx} missing name`);
            }
        });
    }

    // Warning: Check for existing equipment state
    if ((session.characterData as any)?.equipmentSlots) {
        warnings.push('Session already has equipmentSlots - skipping migration');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
