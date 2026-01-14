# Technical Rundown: Fuyuki (Aramancia Tracker)

**Project Goal**: A high-performance, D&D 5e SRD 5.1 compliant tracker specifically optimized for Warlocks and Necromancers. Designed for the Nothing Phone (2a) via PWA/Capacitor.

---

## 🏗️ Architecture & Tech Stack

### 1. Frontend Core
- **React 19 + Vite 7 + TypeScript**: Modern build pipeline with strict type safety.
- **State Management**: Redux Toolkit (RTK).
  - `characterSlice`: HP (Current, Max, Temp), AC, Stats, Pact Slots, Rest Status.
  - `combatSlice`: Initiative tracking and round counting.
  - `spellbookSlice`: Spell lists and usage tracking.
- **Styling**: Tailwind CSS 4 + Headless UI.
  - Kyoto-inspired aesthetic: High-contrast charcoal (#0a0a0a) with vibrant "Banana" gold (#FFD700) and parchment accents.

### 2. Domain Logic (SRD 5.1)
- **Math Engine**: Pure functional logic in `src/utils/srdRules.ts`.
  - AC Derivation (Unarmored, Light, Medium, Heavy, Mage Armor).
  - HP Logic (First level max, subsequent average, min 1/level).
  - Proficiency and Ability Modifiers.
- **Warlock Specifics**: Pact Magic slot tracking with Short Rest recovery.

### 3. Persistence & Safety
- **Redux Listener Middleware**: Debounced (500ms) writes to `localStorage`.
- **Schema Validation**: Zod-based validation on hydration to prevent corruption and handle migrations.

---

## 🛠️ Performance Optimizations
- **Virtualization**: Moving to `tanstack-virtual` for `MinionList` to handle 20-50+ units without frame drops.
- **Memoization Strategy**: Strict use of `useCallback` for all event handlers and `useMemo` for derived stats (AC, DC).
- **Redux Selectors**: Use of `reselect` for memoized state derivations.

---

## 🚀 Priority Roadmap

### Phase A: Stability & Bridge
1. **Global Error Boundary**: Implement `GlobalErrorBoundary.tsx` wrapping the entire app.
2. **Capacitor Init**: Setup `capacitor.config.ts` for native Android bridging.
3. **Input Sanitization**: Add strict bounds checking (1-9999) and type coercion for all numeric inputs.

### Phase B: Warlock "Pro" Features
1. **Mystic Arcanum System**: Dedicated UI for tracking 6th-9th level "once per long rest" spells.
2. **Eldritch Invocation Toggles**: A "Ritual" tab for active/passive invocation management.
3. **Concentration Middleware**: Automated "Concentration Check" prompt when character takes damage.

---

## 🤖 LLM Review Directives
When reviewing or assisting with this codebase, follow these rules:
1. **Functional-First**: Prefer functional components and hooks over classes.
2. **Rules as Written (RAW)**: Strict adherence to SRD 5.1 rules. No "homebrew" logic unless explicitly flagged.
3. **Performance Awareness**: Always consider the render cost of mapping over arrays. Suggest virtualization first.
4. **Thematic Integrity**: Maintain the "Kyoto Noir" aesthetic. Use designated color tokens (`bg-zinc-950`, `text-gold-400`).
5. **Preflight Protocol**: All changes must pass `./preflight.sh` (lint + typecheck + test).

---

## 🔮 Future Ideas
- **Native Haptics**: Integration via Capacitor Haptics API for critical hits/damage.
- **Open5e Cloud Sync**: RTK Query integration for spell lookups with offline caching.
- **AR Portrait**: Capacitor Camera integration to overlay character features on user-provided photos.
