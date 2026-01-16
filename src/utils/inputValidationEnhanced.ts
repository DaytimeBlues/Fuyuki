/**
 * Input Validation with Enhanced Error Messages
 *
 * WHY: Provide better user feedback when input validation fails
 * with actionable suggestions for fixing issues.
 */

import { z } from 'zod';

type ValidationIssue = 'required' | 'invalid' | 'out_of_range';

const validationMessages: Record<ValidationIssue, string> = {
    required: 'is required',
    invalid: 'is invalid',
    out_of_range: 'is out of range',
};

const validationSuggestions: Record<ValidationIssue, string> = {
    required: 'Please enter a value',
    invalid: 'Please enter a valid value',
    out_of_range: 'Please check the valid range',
};

function getValidationError(field: string, issue: ValidationIssue): { message: string; suggestion: string } {
    return {
        message: `${field} ${validationMessages[issue]}`,
        suggestion: validationSuggestions[issue],
    };
}

// Session number validation
export const SessionNumberSchema = z.number()
    .int('Session number must be a whole number')
    .min(1, 'Session number must be at least 1')
    .max(9999, 'Session number cannot exceed 9999');

// Ability score validation
export const AbilityScoreSchema = z.object({
    str: z.number()
        .int('Strength must be a whole number')
        .min(3, 'Strength score minimum is 3 (SRD standard)')
        .max(30, 'Strength score maximum is 30'),
    dex: z.number()
        .int('Dexterity must be a whole number')
        .min(3, 'Dexterity score minimum is 3 (SRD standard)')
        .max(30, 'Dexterity score maximum is 30'),
    con: z.number()
        .int('Constitution must be a whole number')
        .min(3, 'Constitution score minimum is 3 (SRD standard)')
        .max(30, 'Constitution score maximum is 30'),
    int: z.number()
        .int('Intelligence must be a whole number')
        .min(3, 'Intelligence score minimum is 3 (SRD standard)')
        .max(30, 'Intelligence score maximum is 30'),
    wis: z.number()
        .int('Wisdom must be a whole number')
        .min(3, 'Wisdom score minimum is 3 (SRD standard)')
        .max(30, 'Wisdom score maximum is 30'),
    cha: z.number()
        .int('Charisma must be a whole number')
        .min(3, 'Charisma score minimum is 3 (SRD standard)')
        .max(30, 'Charisma score maximum is 30'),
});

// Level validation
export const LevelSchema = z.number()
    .int('Level must be a whole number')
    .min(1, 'Level cannot be below 1')
    .max(20, 'Level cannot exceed 20 (SRD maximum)');

// HP validation
export const CurrentHPSchema = z.number()
    .int('Current HP must be a whole number')
    .min(-999, 'HP cannot be below -999 for tracking purposes')
    .max(9999, 'HP cannot exceed 9999');

export const MaxHPSchema = z.number()
    .int('Maximum HP must be a positive whole number')
    .min(1, 'Maximum HP cannot be below 1')
    .max(9999, 'Maximum HP cannot exceed 9999');

export const TempHPSchema = z.number()
    .int('Temporary HP must be a whole number')
    .min(0, 'Temporary HP cannot be negative')
    .max(9999, 'Temporary HP cannot exceed 9999');

/**
 * Validate session number with error message
 */
export function validateAndClampSessionNumber(
    value: unknown,
    showToast: boolean = true
): number {
    try {
        const num = parseInt(String(value)) || 1;
        const validated = SessionNumberSchema.parse(num);

        if (showToast) {
            console.warn('Toast would show for invalid session number');
        }

        return validated;
    } catch (error) {
        const issue = error instanceof z.ZodError ? 'invalid' : 'required';
        const { message, suggestion } = getValidationError('Session Number', issue);
        
        console.warn('Validation error:', message, suggestion);
        return 1;
    }
}

/**
 * Validate ability score with error message
 */
export function validateAndClampAbilityScore(
    ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha',
    value: unknown,
    showToast: boolean = true
): number {
    try {
        const num = parseInt(String(value)) || 10;
        const validated = AbilityScoreSchema.parse({ [ability]: num });

        if (showToast) {
            console.warn('Toast would show for invalid ability score');
        }

        return validated[ability];
    } catch (error) {
        const issue = error instanceof z.ZodError ? 'invalid' : 'required';
        const { message, suggestion } = getValidationError(ability.charAt(0).toUpperCase() + ability.slice(1), issue);
        
        console.warn('Validation error:', message, suggestion);
        return 10;
    }
}

/**
 * Validate level with error message
 */
export function validateAndClampLevel(
    value: unknown,
    showToast: boolean = true
): number {
    try {
        const num = parseInt(String(value)) || 1;
        const validated = LevelSchema.parse(num);

        if (showToast) {
            console.warn('Toast would show for invalid level');
        }

        return validated;
    } catch (error) {
        const issue = error instanceof z.ZodError ? 'invalid' : 'required';
        const { message, suggestion } = getValidationError('Level', issue);
        
        console.warn('Validation error:', message, suggestion);
        return 1;
    }
}

/**
 * Validate HP value with error message
 */
export function validateHP(value: unknown, type: 'current' | 'max' | 'temp'): number {
    try {
        const num = parseInt(String(value)) || 0;
        let schema;

        if (type === 'current') {
            schema = CurrentHPSchema;
        } else if (type === 'max') {
            schema = MaxHPSchema;
        } else if (type === 'temp') {
            schema = TempHPSchema;
        } else {
            schema = CurrentHPSchema;
        }

        const validated = schema.parse(num);
        return validated;
    } catch {
        const issue = 'invalid';
        const { message, suggestion } = getValidationError('HP', issue);
        
        console.warn('Validation error:', message, suggestion);
        return 0;
    }
}

/**
 * Check if value is within valid range (for UI feedback)
 */
export function isValueValid(value: unknown, type: 'session' | 'ability' | 'level' | 'hp'): boolean {
    try {
        switch (type) {
            case 'session': {
                const parsed = parseInt(String(value), 10) || 1;
                return SessionNumberSchema.safeParse(parsed).success;
            }
            case 'ability': {
                const ability = value as keyof z.infer<typeof AbilityScoreSchema>;
                const parsed = parseInt(String(value), 10) || 10;
                return AbilityScoreSchema.safeParse({ [ability]: parsed }).success;
            }
            case 'level': {
                const parsed = parseInt(String(value), 10) || 1;
                return LevelSchema.safeParse(parsed).success;
            }
            case 'hp': {
                const parsed = parseInt(String(value), 10) || 0;
                return CurrentHPSchema.safeParse(parsed).success;
            }
            default:
                return true;
        }
    } catch {
        return false;
    }
}

/**
 * Get validation error message for display
 */
export function getValidationErrorMessage(
    value: unknown,
    type: 'session' | 'ability' | 'level' | 'hp'
): string | null {
    try {
        switch (type) {
            case 'session': {
                const result = SessionNumberSchema.safeParse(parseInt(String(value), 10) || 1);
                if (!result.success) {
                    return result.error.issues[0]?.message;
                }
                return null;
            }
            case 'ability': {
                const ability = value as keyof z.infer<typeof AbilityScoreSchema>;
                const result = AbilityScoreSchema.safeParse({ [ability]: parseInt(String(value), 10) || 10 });
                if (!result.success) {
                    return result.error.issues[0]?.message;
                }
                return null;
            }
            case 'level': {
                const result = LevelSchema.safeParse(parseInt(String(value), 10) || 1);
                if (!result.success) {
                    return result.error.issues[0]?.message;
                }
                return null;
            }
            case 'hp': {
                const result = CurrentHPSchema.safeParse(parseInt(String(value), 10) || 0);
                if (!result.success) {
                    return result.error.issues[0]?.message;
                }
                return null;
            }
            default:
                return null;
        }
    } catch {
        return 'Unable to validate input';
    }
}

/**
 * Format validation result for UI display
 */
export function formatValidationResult(
    isValid: boolean,
    errorMessage: string | null,
    fieldName?: string
): {
    isValid: boolean
    showWarning: boolean
    message: string
} {
    if (isValid) {
        return {
            isValid: true,
            showWarning: false,
            message: fieldName ? `${fieldName} is valid` : 'Input is valid',
        };
    } else {
        return {
            isValid: false,
            showWarning: true,
            message: errorMessage || 'Invalid input',
        };
    }
}
