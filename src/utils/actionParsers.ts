/**
 * actionParsers.ts - Pure logic for extracting mechanics from stat block descriptions.
 * GROUNDING: Standardizes parsing for SRD-style action descriptions.
 */

/**
 * Extracts the "to hit" bonus from an action description.
 * Example: "+5 to hit" -> 5
 */
export function extractToHit(desc: string): number | null {
    const m = desc.match(/\+\s*(\d+)\s*to hit/i);
    if (!m) return null;
    const n = Number.parseInt(m[1], 10);
    return Number.isFinite(n) ? n : null;
}

/**
 * Extracts the damage formula from an action description.
 * Example: "Hit: 7 (1d6 + 4) necrotic damage" -> "1d6+4"
 */
export function extractDamageFormula(desc: string): string | null {
    const paren = desc.match(/Hit:\s*[^()]*\(([^)]+)\)/i);
    if (paren?.[1]) return paren[1].replace(/\s+/g, '');
    const inline = desc.match(/Hit:\s*([0-9]+d[0-9]+(?:\s*[+-]\s*\d+)*)/i);
    if (inline?.[1]) return inline[1].replace(/\s+/g, '');
    return null;
}
