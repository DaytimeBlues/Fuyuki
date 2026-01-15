import { z } from 'zod';

export const SessionNumberSchema = z.number().int().min(1).max(9999);
export const AbilityScoreSchema = z.number().int().min(3).max(30);
export const LevelSchema = z.number().int().min(1).max(20);

export function validateAndClampSessionNumber(value: unknown): number {
    const num = parseInt(String(value)) || 1;
    const validated = SessionNumberSchema.parse(num);
    return validated;
}

export function validateAndClampAbilityScore(value: unknown): number {
    const num = parseInt(String(value)) || 10;
    const validated = AbilityScoreSchema.parse(num);
    return validated;
}

export function validateAndClampLevel(value: unknown): number {
    const num = parseInt(String(value)) || 1;
    const validated = LevelSchema.parse(num);
    return validated;
}
