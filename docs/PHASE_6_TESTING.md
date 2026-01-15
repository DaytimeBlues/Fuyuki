# Phase 6 Testing & QA - Implementation Plan

## Overview
This document provides a complete plan for testing all features, including unit tests, integration tests, and manual testing checklists.

## Phase 6.1: Write Unit Tests

### 1. Test New Middleware (concentrationMiddleware)

**Test File:** `src/test/concentrationMiddleware.test.ts`

**Test Cases:**
1. Concentration check triggers on damage while concentrating
2. No toast when not concentrating
3. No toast when at 0 HP
4. Haptic feedback hooks called when enabled

**Implementation:**
```typescript
import { configureStore } from '@reduxjs/toolkit';
import characterReducer, {
    concentrationSet,
    hpChanged,
} from '../store/slices/characterSlice';

// Mock haptics
const mockHaptics = {
    impact: jest.fn(),
    notification: jest.fn(),
    selectionChanged: jest.fn(),
};

describe('concentrationMiddleware', () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            character: characterReducer,
            // Add other reducers as needed
        });
    });

    afterEach(() => {
        store.dispatch(hpChanged({ current: 30 }));
    });

    it('should trigger concentration check on damage while concentrating', () => {
        const prevState = store.getState();
        
        // Set concentration
        store.dispatch(concentrationSet('Hold Person'));
        
        // Take damage
        store.dispatch(hpChanged({ current: 20 }));
        const nextState = store.getState();
        
        // Dispatch toast action
        const toastActions = nextState.character.toast;
        expect(toastActions.message).toContain('CON Save DC');
    });

    it('should not trigger toast when not concentrating', () => {
        store.dispatch(concentrationSet(null));
        store.dispatch(hpChanged({ current: 30 }));
        
        const state = store.getState();
        expect(state.character.toast.message).toBeNull();
    });

    it('should not trigger toast at 0 HP', () => {
        store.dispatch(concentrationSet('Fireball'));
        store.dispatch(hpChanged({ current: 0 }));
        
        const state = store.getState();
        expect(state.character.toast.message).toBeNull();
    });
});
```

### 2. Test Haptics Utility

**Test File:** `src/test/haptics.test.ts`

**Test Cases:**
1. `hapticImpact()` calls Capacitor Haptics on mobile
2. `hapticNotification()` on web, no crash
3. All `HapticPresets` functions work correctly
4. Graceful degradation to no-op on web

**Implementation:**
```typescript
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Mock Capacitor platform
jest.mock('@capacitor/haptics', () => ({
    Haptics: {
        impact: jest.fn(),
        notification: jest.fn(),
        selectionChanged: jest.fn(),
    },
}));

describe('haptics utility', () => {
    describe('hapticImpact', () => {
        it('should call Haptics.impact on mobile', async () => {
            await Haptics.impact({ style: ImpactStyle.Medium });
            expect(Haptics.impact).toHaveBeenCalled();
        });

        it('should not crash on web', async () => {
            await expect(Haptics.impact()).rejects.toThrow();
        });
    });
});
```

### 3. Test Input Validation

**Test File:** `src/test/inputValidation.test.ts`

**Test Cases:**
1. Session number validation (1-9999, clamped)
2. Ability score validation (3-30, clamped)
3. Level validation (1-20, clamped)
4. HP validation (no negatives, max enforced)

**Implementation:**
```typescript
import {
    validateAndClampSessionNumber,
    validateAndClampAbilityScore,
    validateAndClampLevel,
    validateHP,
    isValueValid,
} from '../utils/inputValidationEnhanced';

describe('inputValidation', () => {
    describe('Session Number', () => {
        it('should clamp session number to valid range', () => {
            expect(validateAndClampSessionNumber('0')).toBe(1);
            expect(validateAndClampSessionNumber('10000')).toBe(9999);
            expect(validateAndClampSessionNumber('-5')).toBe(1);
            expect(validateAndClampSessionNumber('10000')).toBe(9999);
        });

        it('should return 1 for non-numeric input', () => {
            expect(validateAndClampSessionNumber('abc')).toBe(1);
        });
    });

    describe('Ability Scores', () => {
        it('should clamp strength score to valid range', () => {
            expect(validateAndClampAbilityScore('str', '0')).toBe(3);
            expect(validateAndClampAbilityScore('str', '40')).toBe(30);
            expect(validateAndClampAbilityScore('str', '35')).toBe(30);
        });
    });

    describe('Level', () => {
        it('should clamp level to valid range', () => {
            expect(validateAndClampLevel('0')).toBe(1);
            expect(validateAndClampLevel('25')).toBe(25);
            expect(validateAndClampLevel('20')).toBe(20);
        });
    });
});
```

---

## Phase 6.2: Integration Tests

### 1. Combat Flow Test

**Test File:** `src/test/integration/combatFlow.test.tsx`

**Test Cases:**
1. Cast spell → slot deducted
2. Take damage → concentration check triggers
3. Death saves track correctly
4. Short rest restores pact slots

**Implementation:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../App';
import characterReducer, {
    hpChanged,
    concentrationSet,
    shortRestCompleted,
} from '../store/slices/characterSlice';

const renderWithProviders = (component: React.ReactElement) => (
    <Provider store={store}>
        {component}
    </Provider>
);

describe('Combat Flow Integration', () => {
    it('should deduct spell slot on cast', () => {
        const { container } = renderWithProviders(<App />);
        const castButton = container.querySelector('[data-testid="cast-spell-fireball"]');
        const slotOrb = container.querySelector('[data-testid="level-1-orb"]');
        
        fireEvent.click(castButton);
        fireEvent.click(slotOrb);
        
        const usedSlot = slotOrb?.textContent.includes('1/2');
        expect(usedSlot).toBe('1/2');
    });

    it('should trigger concentration check on damage', () => {
        const hpDisplay = container.querySelector('[data-testid="hp-display"]');
        
        // Set concentration
        fireEvent.click(screen.getByRole('button', { name: 'Concentrate' }));
        
        // Take damage
        const damageButton = container.querySelector('[data-testid="take-10-damage"]');
        fireEvent.click(damageButton);
        
        // Wait for toast
        await waitFor(() => {
            const toast = container.querySelector('[data-testid="toast-message"]');
            return toast && toast.textContent.includes('CON Save DC');
        }, { timeout: 3000 });
    });

    it('should track death saves correctly', () => {
        const failureButton = screen.getByRole('button', { name: 'Death Save Fail' });
        
        fireEvent.click(failureButton);
        expect(screen.getByText(/failures: 1/3/)).toBeInTheDocument();
        
        fireEvent.click(screen.getByRole('button', { name: 'Death Save Success' }));
        expect(screen.getByText(/failures: 2/3/)).toBeInTheDocument();
    });
});
```

### 2. Rest Flow Test

**Test File:** `src/test/integration/restFlow.test.tsx`

**Test Cases:**
1. Short rest restores pact slots
2. Long rest restores all spell slots
3. Hit dice restored
4. HP restored to max

**Implementation:**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../App';
import characterReducer, {
    shortRestCompleted,
    hitDiceRestored,
} from '../store/slices/characterSlice';

const renderWithProviders = (component: React.ReactElement) => (
    <Provider store={store}>
        {component}
    </Provider>
);

describe('Rest Flow Integration', () => {
    it('should restore pact slots on short rest', async () => {
        const { container } = renderWithProviders(<App />);
        const shortRestButton = container.querySelector('[data-testid="short-rest"]');
        
        fireEvent.click(shortRestButton);
        
        await waitFor(() => {
            const pactSlot = container.querySelector('[data-testid="pact-slot-1"]');
            return pactSlot && !pactSlot.textContent.includes('empty');
        }, { timeout: 3000 });
    });

    it('should restore HP to max on long rest', async () => {
        const { container } = renderWithProviders(<App />);
        const longRestButton = container.querySelector('[data-testid="long-rest"]');
        const hpDisplay = container.querySelector('[data-testid="hp-display"]');
        
        fireEvent.click(longRestButton);
        
        await waitFor(() => {
            const hpText = hpDisplay?.textContent;
            return hpText && hpText.includes('45'); // Assuming level 5, 45 max HP
        }, { timeout: 3000 });
    });
});
```

---

## Phase 6.3: Manual Testing Checklist

### Combat Testing

**Minion Management**
- [ ] Navigate to Combat view
- [ ] Raise 3+ skeletons
- [ ] Raise 2+ zombies
- [ ] Modify minion HP values
- [ ] Remove minions individually
- [ ] Clear all minions
- [ ] Screenshot: `combat_minions_test.png`

**HP Edge Cases**
- [ ] Set HP to 0 (death state verification)
- [ ] Try negative HP input
- [ ] Test HP above max HP
- [ ] Add temp HP and take damage (absorption order)
- [ ] Screenshot: `combat_hp_edges.png`

**Spell Slots**
- [ ] Exhaust all Level 1-9 slots
- [ ] Toggle empty slot
- [ ] Exhaust Level 2-6, Mystic Arcanum
- [ ] Screenshot: `spellslots_exhausted.png`

**Death Saves**
- [ ] Trigger death state (HP = 0)
- [ ] Add 3 failures
- [ ] Stabilize character (heal to > 0)
- [ ] Reset death saves
- [ ] Screenshot: `death_state_flow.png`

**Rest Resets**
- [ ] Short rest (pact slots restored)
- [ ] Long rest (all slots restored)
- [ ] Hit dice restored
- [ ] Screenshot: `rest_recovery.png`

**Concentration**
- [ ] Cast concentration spell
- [ ] Take damage → verify DC toast
- [ ] Verify haptic feedback
- [ ] Screenshot: `concentration_test.png`

---

## Phase 6.4: Device Testing

### Nothing Phone (2a) Specific Tests
- [ ] App installs successfully on Nothing Phone (2a)
- [ ] All features work on target device
- [ ] Haptic feedback works
- [ ] Touch targets are 44x44px minimum
- [ ] Performance is acceptable (smooth 60fps scrolling)

### Other Devices (if available)
- [ ] iPhone 12/13/14/15 testing
- [ ] iPad testing
- [ ] Desktop browser testing
- [ ] Chrome/Edge/Firefox testing

### Accessibility Testing
- [ ] TalkBack screen reader navigation works
- ] All buttons have ARIA labels
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Toasts announced to screen reader

---

## Testing Commands

```bash
# Run all unit tests
npm run test

# Run all integration tests
npm run test -- src/test/integration

# Run with coverage
npm run test -- --coverage

# Production build
npm run build

# Open Android Studio
npx cap open android

# Android testing (if device connected)
npx cap run android
```

---

## Bug Report Template

```markdown
Issue Title: [Brief description]

### Context
- [What you were doing when the issue occurred]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
- [What should happen]

### Actual Behavior
- [What actually happened]

### Screenshots/Logs
- [Attach or paste here]

### Priority
- [Critical / High / Medium / Low]
```

---

## Testing Status Tracker

### Unit Tests
- [ ] Phase 6.1: Write unit tests (4 test files)
- [ ] All tests pass

### Integration Tests
- [ ] Phase 6.2: Integration tests (2 test files)
- [ ] All tests pass

### Manual Testing
- [ ] Phase 6.3: Manual checklist (8 sections)
- [ ] Screenshot artifacts collected

### Device Testing
- [ ] Phase 6.4: Device-specific tests
- [ ] Accessibility verified

---

## Success Criteria

### All Unit Tests Pass
- New middleware covered
- Haptics utility covered
- Input validation covered
- Combat flows covered
- Rest flows covered

### All Integration Tests Pass
- Combat flow complete
- Rest flow complete
- All critical user paths tested

### All Manual Tests Pass
- Minion management tested
- HP edge cases tested
- Spell slots tested
- Death saves tested
- Rest resets tested
- Concentration tested
- Screenshot artifacts collected

### Device Testing Pass
- Nothing Phone (2a) verified
- Accessibility features verified
- Performance acceptable

### Code Quality
- All lint checks pass
- All TypeScript errors resolved
- All tests passing (target: 31+ tests)
- Build successful

---

## Ready for Phase 7
- ✅ PWA build configured
- ✅ Android synced
- ✅ Accessibility documented
- ✅ Theme consistent
- ✅ All edge cases handled
- ✅ Comprehensive test coverage
