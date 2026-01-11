export function getRequiredLevelForSpell(spellLevel: number): number {
    if (spellLevel <= 0) return 1;
    return Math.max(1, spellLevel * 2 - 1);
}
