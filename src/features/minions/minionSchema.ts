import { z } from 'zod';

export const MINION_NAME_MAX = 50;
export const MINION_AC_MAX = 30;

export const minionSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1).max(MINION_NAME_MAX),
    hp: z.number().finite().nonnegative(),
    ac: z.number().finite().min(0).max(MINION_AC_MAX),
});

export const minionListSchema = z.array(minionSchema);

export type Minion = z.infer<typeof minionSchema>;
