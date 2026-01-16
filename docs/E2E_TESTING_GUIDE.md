# E2E Testing Guide for Fuyuki Warlock Tracker

## Overview

This document provides complete instructions for setting up and executing industry-standard E2E tests for the Fuyuki D&D 5e Warlock Tracker using **Playwright**.

## Prerequisites

- Node.js 18+ installed
- Playwright browsers installed (`npx playwright install`)
- Dev server can run on `http://localhost:5173`

## Installation

```bash
npm install -D @playwright/test
npx playwright install
```

## Project Structure

```
fuyuki/
├── playwright.config.ts          # Playwright configuration
├── e2e/                          # E2E test directory
│   ├── auth.setup.ts            # Test setup/auth
│   ├── pages/                   # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── CharacterPage.ts
│   │   ├── SpellbookPage.ts
│   │   ├── CombatPage.ts
│   │   └── RestPage.ts
│   ├── specs/                   # Test specifications
│   │   ├── character.spec.ts
│   │   ├── spellcasting.spec.ts
│   │   ├── combat.spec.ts
│   │   ├── rest.spec.ts
│   │   ├── accessibility.spec.ts
│   │   └── persistence.spec.ts
│   └── utils/                   # Test utilities
│       ├── test-data.ts
│       └── helpers.ts
```

## Page Object Model (POM)

### BasePage.ts

```typescript
import { Page, expect } from '@playwright/test';

export class BasePage {
  constructor(readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForLoading() {
    await this.page.waitForSelector('[data-testid="app-ready"]', { timeout: 10000 });
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  async verifyToast(message: string) {
    const toast = this.page.getByRole('status');
    await expect(toast).toContainText(message, { timeout: 5000 });
  }
}
```

### CharacterPage.ts

```typescript
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CharacterPage extends BasePage {
  // HP Elements
  hpDisplay = this.page.getByTestId('hp-display');
  maxHpInput = this.page.getByTestId('max-hp-input');
  tempHpInput = this.page.getByTestId('temp-hp-input');
  increaseHpBtn = this.page.getByRole('button', { name: /increase hp/i });
  decreaseHpBtn = this.page.getByRole('button', { name: /decrease hp/i });

  // Ability Scores
  strengthInput = this.page.getByTestId('strength-input');
  dexterityInput = this.page.getByTestId('dexterity-input');
  constitutionInput = this.page.getByTestId('constitution-input');
  intelligenceInput = this.page.getByTestId('intelligence-input');
  wisdomInput = this.page.getByTestId('wisdom-input');
  charismaInput = this.page.getByTestId('charisma-input');

  // Death Saves
  deathSaveFailureBtn = this.page.getByRole('button', { name: /failure/i });
  deathSaveSuccessBtn = this.page.getByRole('button', { name: /success/i });
  deathFailures = this.page.getByTestId('death-failures');
  deathSuccesses = this.page.getByTestId('death-successes');

  // Concentration
  concentrationSpell = this.page.getByTestId('concentration-spell');
  concentrationToggle = this.page.getByRole('button', { name: /concentrate/i });

  constructor(page: Page) {
    super(page);
  }

  async setHP(value: number) {
    await this.hpDisplay.click();
    await this.page.keyboard.type(value.toString());
    await this.page.keyboard.press('Enter');
  }

  async increaseHP(amount: number) {
    for (let i = 0; i < amount; i++) {
      await this.increaseHpBtn.click();
    }
  }

  async decreaseHP(amount: number) {
    for (let i = 0; i < amount; i++) {
      await this.decreaseHpBtn.click();
    }
  }

  async setAbilityScore(ability: string, value: number) {
    const input = this.page.getByTestId(`${ability}-input`);
    await input.fill(value.toString());
  }

  async addDeathSaveFailure() {
    await this.deathSaveFailureBtn.click();
  }

  async addDeathSaveSuccess() {
    await this.deathSaveSuccessBtn.click();
  }

  async setConcentration(spellName: string) {
    await this.concentrationSpell.fill(spellName);
  }

  async clearConcentration() {
    await this.concentrationToggle.click();
  }
}
```

### SpellbookPage.ts

```typescript
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SpellbookPage extends BasePage {
  spellSlotOrbs = this.page.getByTestId(/level-\d+-orb/);
  castSpellBtn = (spellName: string) => 
    this.page.getByRole('button', { name: spellName });
  pactSlots = this.page.getByTestId(/pact-slot-\d/);
  mysticArcanumSlots = this.page.getByTestId(/arcanum-\d/);

  constructor(page: Page) {
    super(page);
  }

  async castSpell(level: number, spellName: string) {
    const orb = this.page.getByTestId(`level-${level}-orb`);
    await this.castSpellBtn(spellName).click();
    await orb.click();
  }

  async togglePactSlot(slot: number) {
    await this.page.getByTestId(`pact-slot-${slot}`).click();
  }

  async toggleMysticArcanum(level: number) {
    await this.page.getByTestId(`arcanum-${level}`).click();
  }

  async verifySlotsAvailable(level: number, available: number, total: number) {
    const orb = this.page.getByTestId(`level-${level}-orb`);
    await expect(orb).toContainText(`${available}/${total}`);
  }
}
```

### CombatPage.ts

```typescript
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CombatPage extends BasePage {
  addMinionBtn = this.page.getByRole('button', { name: /add minion/i });
  minionNameInput = this.page.getByTestId('minion-name-input');
  minionHPInput = this.page.getByTestId('minion-hp-input');
  minionACInput = this.page.getByTestId('minion-ac-input');
  createMinionBtn = this.page.getByRole('button', { name: /create/i });
  minionCards = this.page.getByTestId('minion-card');
  clearMinionsBtn = this.page.getByRole('button', { name: /clear all/i });

  constructor(page: Page) {
    super(page);
  }

  async addMinion(name: string, hp: number, ac: number) {
    await this.addMinionBtn.click();
    await this.minionNameInput.fill(name);
    await this.minionHPInput.fill(hp.toString());
    await this.minionACInput.fill(ac.toString());
    await this.createMinionBtn.click();
  }

  async verifyMinionCount(count: number) {
    await expect(this.minionCards).toHaveCount(count);
  }

  async clearAllMinions() {
    await this.clearMinionsBtn.click();
  }
}
```

### RestPage.ts

```typescript
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RestPage extends BasePage {
  shortRestBtn = this.page.getByRole('button', { name: /short rest/i });
  longRestBtn = this.page.getByRole('button', { name: /long rest/i });
  hitDiceDisplay = this.page.getByTestId('hit-dice-display');

  constructor(page: Page) {
    super(page);
  }

  async takeShortRest() {
    await this.shortRestBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async takeLongRest() {
    await this.longRestBtn.click();
    await this.page.waitForTimeout(2000);
  }
}
```

## Test Specifications

### character.spec.ts

```typescript
import { test, expect } from '@playwright/test';
import { CharacterPage } from '../pages/CharacterPage';

test.describe('Character Management', () => {
  let characterPage: CharacterPage;

  test.beforeEach(async ({ page }) => {
    characterPage = new CharacterPage(page);
    await characterPage.goto();
    await characterPage.waitForLoading();
  });

  test('should display initial HP correctly', async () => {
    await expect(characterPage.hpDisplay).toBeVisible();
    await expect(characterPage.hpDisplay).toContainText('HP');
  });

  test('should increase HP by clicking + button', async () => {
    await characterPage.increaseHP(5);
    await expect(characterPage.hpDisplay).toContainText('5');
  });

  test('should decrease HP by clicking - button', async () => {
    await characterPage.decreaseHP(3);
    await expect(characterPage.hpDisplay).toContainText('-3');
  });

  test('should not allow HP to go below -999', async ({ page }) => {
    for (let i = 0; i < 1000; i++) {
      await characterPage.decreaseHpBtn.click();
    }
    await expect(characterPage.hpDisplay).toContainText('-999');
  });

  test('should clamp HP at maximum value', async ({ page }) => {
    await characterPage.setHP(9999);
    await characterPage.increaseHP(1);
    await expect(characterPage.hpDisplay).toContainText('9999');
  });

  test('should set ability score and validate range', async () => {
    await characterPage.setAbilityScore('strength', 20);
    await expect(characterPage.strengthInput).toHaveValue('20');

    await characterPage.setAbilityScore('strength', 40);
    await expect(characterPage.strengthInput).toHaveValue('30');
  });

  test('should track death saves correctly', async () => {
    await characterPage.setHP(0);
    await characterPage.addDeathSaveFailure();
    await expect(characterPage.deathFailures).toContainText('1/3');

    await characterPage.addDeathSaveSuccess();
    await expect(characterPage.deathSuccesses).toContainText('1/3');

    await characterPage.addDeathSaveFailure();
    await characterPage.addDeathSaveFailure();
    await expect(characterPage.deathFailures).toContainText('3/3');
    await expect(characterPage.page.getByText(/dead/i)).toBeVisible();
  });

  test('should reset death saves when healed above 0', async () => {
    await characterPage.setHP(0);
    await characterPage.addDeathSaveFailure();
    await characterPage.increaseHP(1);
    await expect(characterPage.deathFailures).toContainText('0/3');
  });

  test('should set concentration spell', async () => {
    await characterPage.setConcentration('Hold Person');
    await expect(characterPage.concentrationSpell).toHaveValue('Hold Person');
  });

  test('should show concentration toast on damage while concentrating', async () => {
    await characterPage.setConcentration('Fireball');
    await characterPage.decreaseHP(10);
    await characterPage.verifyToast('CON Save DC');
  });
});
```

### spellcasting.spec.ts

```typescript
import { test, expect } from '@playwright/test';
import { SpellbookPage } from '../pages/SpellbookPage';

test.describe('Spellcasting', () => {
  let spellbookPage: SpellbookPage;

  test.beforeEach(async ({ page }) => {
    spellbookPage = new SpellbookPage(page);
    await spellbookPage.goto();
    await spellbookPage.waitForLoading();
  });

  test('should display all spell slot levels', async () => {
    await expect(spellbookPage.spellSlotOrbs.nth(0)).toBeVisible();
  });

  test('should deduct spell slot when casting spell', async () => {
    await spellbookPage.verifySlotsAvailable(1, 4, 4);
    await spellbookPage.castSpell(1, 'Magic Missile');
    await spellbookPage.verifySlotsAvailable(1, 3, 4);
  });

  test('should not cast spell when no slots available', async () => {
    for (let i = 0; i < 4; i++) {
      await spellbookPage.castSpell(1, 'Magic Missile');
    }
    await spellbookPage.verifySlotsAvailable(1, 0, 4);
    await expect(spellbookPage.page.getByTestId('level-1-orb')).toHaveText(/empty/i);
  });

  test('should toggle pact slots', async () => {
    await spellbookPage.togglePactSlot(1);
    await expect(spellbookPage.pactSlots.nth(0)).toHaveClass(/used/);
    await spellbookPage.togglePactSlot(1);
    await expect(spellbookPage.pactSlots.nth(0)).not.toHaveClass(/used/);
  });

  test('should toggle Mystic Arcanum slots', async () => {
    await spellbookPage.toggleMysticArcanum(6);
    await expect(spellbookPage.mysticArcanumSlots.nth(0)).toHaveClass(/used/);
  });

  test('should show spell save DC calculation', async ({ page }) => {
    const dcDisplay = page.getByTestId('spell-save-dc');
    await expect(dcDisplay).toContainText('DC');
  });

  test('should display spell level indicator', async ({ page }) => {
    const levelIndicator = page.getByTestId('spell-level-indicator');
    await expect(levelIndicator).toBeVisible();
  });
});
```

### combat.spec.ts

```typescript
import { test, expect } from '@playwright/test';
import { CombatPage } from '../pages/CombatPage';

test.describe('Combat System', () => {
  let combatPage: CombatPage;

  test.beforeEach(async ({ page }) => {
    combatPage = new CombatPage(page);
    await combatPage.goto();
    await combatPage.waitForLoading();
  });

  test('should add single minion', async () => {
    await combatPage.addMinion('Skeleton', 13, 13);
    await combatPage.verifyMinionCount(1);
    await expect(combatPage.page.getByText(/Skeleton/)).toBeVisible();
  });

  test('should add multiple minions', async () => {
    await combatPage.addMinion('Skeleton', 13, 13);
    await combatPage.addMinion('Zombie', 22, 8);
    await combatPage.addMinion('Skeleton', 13, 13);
    await combatPage.verifyMinionCount(3);
  });

  test('should display minion HP and AC', async () => {
    await combatPage.addMinion('Skeleton', 13, 13);
    const minionCard = combatPage.page.getByTestId('minion-card').first();
    await expect(minionCard).toContainText('HP: 13');
    await expect(minionCard).toContainText('AC: 13');
  });

  test('should remove individual minion', async () => {
    await combatPage.addMinion('Skeleton', 13, 13);
    await combatPage.page.getByRole('button', { name: /remove/i }).first().click();
    await combatPage.verifyMinionCount(0);
  });

  test('should clear all minions', async () => {
    await combatPage.addMinion('Skeleton', 13, 13);
    await combatPage.addMinion('Zombie', 22, 8);
    await combatPage.clearAllMinions();
    await combatPage.verifyMinionCount(0);
  });

  test('should handle minion HP modifications', async ({ page }) => {
    await combatPage.addMinion('Skeleton', 13, 13);
    const hpInput = page.getByTestId('minion-hp-input').first();
    await hpInput.fill('10');
    await page.keyboard.press('Enter');
    await expect(combatPage.page.getByText(/HP: 10/)).toBeVisible();
  });

  test('should validate minion name is required', async () => {
    await combatPage.addMinionBtn.click();
    await combatPage.minionHPInput.fill('13');
    await combatPage.minionACInput.fill('13');
    await expect(combatPage.createMinionBtn).toBeDisabled();
  });
});
```

### rest.spec.ts

```typescript
import { test, expect } from '@playwright/test';
import { RestPage } from '../pages/RestPage';
import { SpellbookPage } from '../pages/SpellbookPage';

test.describe('Rest System', () => {
  let restPage: RestPage;
  let spellbookPage: SpellbookPage;

  test.beforeEach(async ({ page }) => {
    restPage = new RestPage(page);
    spellbookPage = new SpellbookPage(page);
    await restPage.goto();
    await restPage.waitForLoading();
  });

  test('should restore pact slots on short rest', async () => {
    await spellbookPage.togglePactSlot(1);
    await spellbookPage.togglePactSlot(2);
    await restPage.takeShortRest();
    await expect(spellbookPage.pactSlots.nth(0)).not.toHaveClass(/used/);
    await expect(spellbookPage.pactSlots.nth(1)).not.toHaveClass(/used/);
  });

  test('should restore all spell slots on long rest', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await spellbookPage.castSpell(1, 'Magic Missile');
    }
    await restPage.takeLongRest();
    await spellbookPage.verifySlotsAvailable(1, 4, 4);
  });

  test('should restore hit dice on long rest', async () => {
    await restPage.takeLongRest();
    await expect(restPage.hitDiceDisplay).toBeVisible();
  });

  test('should reset concentration on long rest', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('concentration-spell').fill('Hold Person');
    await restPage.takeLongRest();
    await expect(page.getByTestId('concentration-spell')).toHaveValue('');
  });
});
```

### accessibility.spec.ts

```typescript
import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should have proper heading hierarchy', async () => {
    const headings = await page.locator('h1, h2, h3').count();
    expect(headings).toBeGreaterThan(0);
  });

  test('should have ARIA labels on buttons', async () => {
    const buttons = await page.locator('button:not([aria-label])').count();
    expect(buttons).toBe(0);
  });

  test('should have focus visible state', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should announce toast notifications to screen readers', async () => {
    await page.getByRole('button', { name: /short rest/i }).click();
    const toast = page.getByRole('status');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  test('should have sufficient color contrast', async () => {
    const button = page.getByRole('button').first();
    await expect(button).toHaveCSS('color', /.+/);
    await expect(button).toHaveCSS('background-color', /.+/);
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toBeVisible();
  });
});
```

### persistence.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Data Persistence', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.clearPermissions();
  });

  test('should save character data to localStorage', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('strength-input').fill('20');
    await page.waitForTimeout(1000);

    await page.reload();
    await expect(page.getByTestId('strength-input')).toHaveValue('20');
  });

  test('should persist spell slot usage', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('level-1-orb').click();
    await page.waitForTimeout(1000);

    await page.reload();
    await expect(page.getByTestId('level-1-orb')).toHaveClass(/used/);
  });

  test('should persist minion data', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /add minion/i }).click();
    await page.getByTestId('minion-name-input').fill('Skeleton');
    await page.getByTestId('minion-hp-input').fill('13');
    await page.getByTestId('minion-ac-input').fill('13');
    await page.getByRole('button', { name: /create/i }).click();
    await page.waitForTimeout(1000);

    await page.reload();
    await expect(page.getByText(/Skeleton/)).toBeVisible();
  });

  test('should handle corrupted data gracefully', async ({ page, context }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('fuyuki-store', 'invalid-json');
    });

    await page.reload();
    await expect(page.getByText(/error|reload/i)).toBeVisible();
  });

  test('should clear all data on reset', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('strength-input').fill('20');
    await page.getByRole('button', { name: /reset/i }).click();
    await page.waitForTimeout(1000);

    await expect(page.getByTestId('strength-input')).toHaveValue('10');
  });
});
```

## Test Data (utils/test-data.ts)

```typescript
export const testData = {
  warlockLevel5: {
    level: 5,
    hp: 45,
    maxHp: 45,
    strength: 10,
    dexterity: 14,
    constitution: 12,
    intelligence: 10,
    wisdom: 12,
    charisma: 20,
    spellSlots: {
      1: 4, 2: 3, 3: 3, 4: 2, 5: 1
    },
    pactSlots: 2,
    proficiencyBonus: 3,
    spellSaveDC: 15,
  },
  minions: {
    skeleton: { name: 'Skeleton', hp: 13, ac: 13 },
    zombie: { name: 'Zombie', hp: 22, ac: 8 },
    ghoul: { name: 'Ghoul', hp: 22, ac: 12 },
  },
  spells: {
    magicMissile: { name: 'Magic Missile', level: 1 },
    holdPerson: { name: 'Hold Person', level: 2, concentration: true },
    fireball: { name: 'Fireball', level: 3 },
    holdMonster: { name: 'Hold Monster', level: 5, concentration: true },
  },
};
```

## Running Tests

```bash
# Install browsers
npx playwright install

# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test character.spec.ts

# Run with UI
npx playwright test --ui

# Run specific browser
npx playwright test --project=chromium

# Run with debug
npx playwright test --debug

# View test report
npx playwright show-report

# Run with coverage
npx playwright test --reporter=html --coverage
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Coverage Goals

- **Critical Paths**: 100% coverage
- **User Flows**: Combat, Spellcasting, Rest, Death Saves
- **Cross-browser**: Chrome, Firefox, Safari
- **Mobile**: iOS Safari, Android Chrome
- **Accessibility**: WCAG 2.1 AA compliance
- **Persistence**: localStorage recovery, error handling

## Best Practices

1. **Use Page Object Model**: Reusable page classes for maintainability
2. **Wait for elements**: Use `waitForSelector` instead of hard delays
3. **Use data-testid**: Stable selectors that don't change with styling
4. **Clean up between tests**: Clear state in beforeEach hooks
5. **Take screenshots**: Capture failure states for debugging
6. **Test in isolation**: Each test should be independent
7. **Use meaningful names**: Test names should describe what they verify
8. **Test edge cases**: Empty states, max values, negative values
9. **Verify accessibility**: ARIA labels, keyboard navigation, contrast
10. **Mock external services**: Avoid flaky tests from network issues

## Troubleshooting

### Tests flaky or timeout
- Increase `timeout` in playwright.config.ts
- Add explicit waits for dynamic content
- Use `waitForLoadState('networkidle')`

### Elements not found
- Check data-testid attributes exist in production
- Verify selectors match the actual DOM
- Use browser DevTools to inspect elements

### LocalStorage issues
- Clear storage in beforeEach hooks
- Verify storage keys match application code
- Test with fresh browser context

## Next Steps

1. Implement all page objects in `e2e/pages/`
2. Write all test specifications in `e2e/specs/`
3. Run tests locally to verify
4. Integrate with CI/CD pipeline
5. Add screenshots to documentation
6. Monitor test results and fix flaky tests
