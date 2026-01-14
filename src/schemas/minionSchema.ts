import { z } from 'zod';

export const MinionAttackSchema = z.object({
    name: z.string().min(1),
    toHit: z.number(),
    damage: z.string().min(1),
    damageType: z.string().min(1),
});

export const MinionSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z.enum(['skeleton', 'zombie', 'undead_spirit']),
    form: z.enum(['ghostly', 'putrid', 'skeletal']).optional(),
    hp: z.number().int().min(0),
    maxHp: z.number().int().min(1),
    ac: z.number().int().min(0),
    speed: z.number().int().min(0),
    attacks: z.array(MinionAttackSchema),
    conditions: z.array(z.string()),
    controlExpiresRound: z.number().int().min(0).optional(),
    notes: z.string().optional(),
});
