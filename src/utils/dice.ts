export interface DiceRollBreakdown {
  /** Normalized formula with whitespace removed (e.g. "1d20+5") */
  formula: string;
  /** Final computed total */
  total: number;
  /**
   * Human-readable breakdown, e.g. "1d20[12] + 5 = 17"
   * Useful for UI tooltips/toasts.
   */
  detail: string;
}

/**
 * Rolls a simple dice formula like:
 * - "1d20+5"
 * - "2d4+3"
 * - "d6-1"
 *
 * Supported grammar: a +/- separated sum of terms, where a term is either:
 * - an integer (e.g. "5")
 * - a dice term "[count]d[sides]" (e.g. "2d8", "d20")
 */
export function rollDiceFormula(formula: string, rng: () => number = Math.random): DiceRollBreakdown {
  const normalized = formula.replace(/\s+/g, '').toLowerCase();
  if (!normalized) {
    throw new Error('Empty dice formula');
  }

  // Disallow anything except digits, d, +, -
  if (!/^[0-9d+-]+$/.test(normalized)) {
    throw new Error(`Unsupported dice formula: "${formula}"`);
  }

  const parts = normalized.match(/[+-]?[^+-]+/g) ?? [];
  if (parts.length === 0) {
    throw new Error(`Unsupported dice formula: "${formula}"`);
  }

  let total = 0;
  const detailParts: string[] = [];

  for (const rawPart of parts) {
    const sign = rawPart.startsWith('-') ? -1 : 1;
    const part = rawPart.replace(/^[+-]/, '');
    if (!part) continue;

    if (part.includes('d')) {
      const [countRaw, sidesRaw] = part.split('d');
      const count = countRaw ? Number.parseInt(countRaw, 10) : 1;
      const sides = Number.parseInt(sidesRaw, 10);

      if (!Number.isFinite(count) || !Number.isFinite(sides) || count <= 0 || sides <= 0) {
        throw new Error(`Invalid dice term: "${rawPart}"`);
      }

      const rolls: number[] = [];
      let sum = 0;
      for (let i = 0; i < count; i++) {
        const roll = Math.floor(rng() * sides) + 1;
        rolls.push(roll);
        sum += roll;
      }

      total += sign * sum;
      const signedLabel = `${sign < 0 ? '-' : (detailParts.length ? '+' : '')}${count}d${sides}[${rolls.join(',')}]`;
      detailParts.push(signedLabel);
    } else {
      const value = Number.parseInt(part, 10);
      if (!Number.isFinite(value)) {
        throw new Error(`Invalid numeric term: "${rawPart}"`);
      }
      total += sign * value;
      const signedLabel = `${sign < 0 ? '-' : (detailParts.length ? '+' : '')}${value}`;
      detailParts.push(signedLabel);
    }
  }

  const detail = `${detailParts.join(' ')} = ${total}`;
  return { formula: normalized, total, detail };
}

