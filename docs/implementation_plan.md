# Implementation Plan: Fuyuki "Best of the Best" Edition

This roadmap synthesizes the core architecture of the Aramancia Tracker with specialized Warlock mechanics and "Pro" automation features.

## User Review Required

> [!IMPORTANT]
> **Automation Levels**: The "Concentration Middleware" and "Minion Bulk Rolling" represent a shift from manual tracking to automated assistance.
> **Native Mobile**: Phasing in Capacitor early is critical to ensure feature parity between web and mobile (Nothing Phone 2a).

## Proposed Changes

### Phase 1: Core Hybrid Bridge & Stability
- **Capacitor Init**: Setup `capacitor.config.ts`, Android projects, and splash screens.
- **Global Resilience**: Implement a global `ErrorBoundary` and Zod-based data validation for hydration.
- **Input Sanitization**: Hard-limit all numeric inputs (Level 1-20, Scores 3-30) to prevent state corruption.

### Phase 2: The Warlock Engine
- **Pact Magic System**: Dedicated `slotUsed` logic for pact slots that recover on Short Rest.
- **Rituals & Invocations**: Create a "Ritual" tab for toggling passive invocations (e.g., *Agonizing Blast*, *Armor of Shadows*).
- **Mystic Arcanum Tracking**: Add 6th-9th level "Daily" slot tracking to `RestView`.

### Phase 3: "Best of the Best" Automation
- **Concentration Middleware**: A `listenerMiddleware` that triggers a "CON Save DC" toast whenever HP drops while concentrating.
- **Haptic Bridge**: Integrating `@capacitor/haptics` for tactile feedback on critical events.
- **Virtualization**: Implementing `@tanstack/react-virtual` for the Minion List to support massive undead armies.

### Phase 4: Polish & Aesthetic
- **Kyoto Noir Design**: Full implementation of the Charcoal & Banana Gold palette across all widgets.
- **Micro-Animations**: Staggered slide-in effects for widgets using Tailwind 4 animations.

## Verification Plan

### Automated Tests
- `npm run test`: Ensure SRD 5.1 rules remain 100% accurate.
- `fast-check`: Property-based tests for DC calculations and HP overflow logic.

### Manual Verification
1. **Stress Test**: Spawn 50 minions and verify 120Hz smooth scrolling.
2. **Mobility Audit**: Run on Android via Capacitor and verify Haptic feedback triggers on damage.
3. **Data Recovery**: Corrupt a localStorage session manually and verify the app recovers gracefully via Zod.
