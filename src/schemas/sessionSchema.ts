import { z } from 'zod';

// Helper schema for HP
const HpSchema = z.object({
    current: z.number().int(),
    max: z.number().int().min(1),
    temp: z.number().int().min(0),
});

// Helper for Minions (flexible for now, but structured)
const MinionSchema = z.object({
    id: z.string(),
    type: z.string(),
    name: z.string(),
    hp: HpSchema,
    ac: z.number(),
    notes: z.string().optional(),
    speed: z.number().optional().default(30),
}).passthrough(); // Allow extra fields during migration

// Main Session Schema
export const SessionSchema = z.object({
    id: z.string().uuid(),
    sessionNumber: z.number().int().min(1).max(9999),
    date: z.string(), // We verify it's a string, deeper ISO check optional
    label: z.string().optional(),
    lastModified: z.string(),

    // We validate structure but allow some flexibility for evolved character data
    // to avoid breaking old saves too aggressively before comprehensive migration logic
    characterData: z.object({
        level: z.number().int().min(1).max(20),
        hp: HpSchema,
        // Add other critical fields if needed for strict validation
    }).passthrough(),

    minions: z.array(MinionSchema).optional().default([]),

    // Version for manual parsing if needed
    version: z.string().optional(),
}).passthrough();

export type ValidatedSession = z.infer<typeof SessionSchema>;
