# Aramancia Tracker - Copilot Instructions

## Repository Overview
A D&D 5e character tracker Progressive Web App (PWA) built for tracking HP, AC, spell slots, and combat state with strict RAW (Rules as Written) compliance. The app is designed specifically for Aramancia the Necromancer with features for minion management, concentration tracking, and Wild Shape.

**Tech Stack:** React 19, TypeScript, Vite 7, Tailwind CSS 4, Redux Toolkit, Vitest, Firebase Hosting, Capacitor (Android)  
**Size:** ~335MB, 3200+ TypeScript/TSX files  
**Node Version:** v20.19.6 (npm 10.8.2) - Note: Capacitor CLI requires Node 22+ but runs with warnings on Node 20

## Build & Validation Commands

### Essential Command Sequence
**ALWAYS run commands in this exact order:**

1. **Install dependencies** (required before any other command):
   ```bash
   npm install
   ```
   Takes ~10-15 seconds. Warning about Capacitor engine mismatch is expected and safe to ignore.

2. **Lint** (fast, ~2-3 seconds):
   ```bash
   npm run lint
   ```
   Uses ESLint 9 with TypeScript rules. Zero errors expected on clean builds.

3. **Type checking** (TypeScript validation, ~5-10 seconds):
   ```bash
   npx tsc --noEmit
   ```
   **KNOWN ISSUE:** Currently has 28 type errors related to Minion interface mismatches between `src/types/index.ts` and `src/store/slices/combatSlice.ts`. These are pre-existing and should not be introduced by new changes.

4. **Tests** (~4-5 seconds):
   ```bash
   npm test              # Run once
   npm run test:watch    # Watch mode
   npm run test:ui       # UI mode
   ```
   Uses Vitest with jsdom environment. Setup file: `src/test/setup.ts`
   
   **KNOWN ISSUE:** 4 failing tests in `MinionDrawer.test.tsx` due to missing Redux Provider wrapper. These are pre-existing failures (56/60 tests pass).

5. **Build** (production build, ~20-30 seconds):
   ```bash
   npm run build
   ```
   Runs TypeScript compilation (`tsc -b`) then Vite build. Output: `dist/` directory.
   
   **KNOWN ISSUE:** Build currently fails with same 28 TypeScript errors. Do not attempt to build until type errors are resolved.

6. **Dev server** (development mode):
   ```bash
   npm run dev
   ```
   Starts Vite dev server on http://localhost:5173/ in ~200ms. Use for live development.

7. **Preview** (preview production build):
   ```bash
   npm run preview
   ```
   Serves the `dist/` folder for testing production builds locally.

### Preflight Script
```bash
bash preflight.sh
```
Automated validation script that runs TypeScript checks, logging verification, and build. **Currently fails** on logging check due to overly strict regex that doesn't match the project's actual console.log/console.error usage in error boundaries and utilities.

## CI/CD Pipeline

### GitHub Actions Workflow
**File:** `.github/workflows/ci.yml`  
**Trigger:** Pull requests to `master` branch  
**Runner:** Ubuntu latest with Node.js 20

**Steps (in order):**
1. Checkout code
2. Setup Node.js 20 with npm cache
3. `npm ci` - Clean dependency install
4. `npm run lint` - ESLint validation
5. `npm test -- --coverage` - Tests with coverage report
6. `npm run build` - Production build
7. Upload `dist/` artifact (only on master branch merge)

**IMPORTANT:** CI currently **will fail** on the build step due to pre-existing TypeScript errors. When making changes, ensure you don't introduce new type errors beyond the existing 28.

## Project Architecture

### Directory Structure
```
src/
├── App.tsx                    # Main app component, routing logic
├── main.tsx                   # Entry point, Redux Provider setup
├── index.css                  # Global styles (Tailwind base)
├── store/                     # Redux state management
│   ├── index.ts              # Store configuration
│   ├── hooks.ts              # Typed useAppDispatch/useAppSelector
│   └── slices/
│       ├── characterSlice.ts  # Character state (HP, AC, abilities, etc.)
│       ├── combatSlice.ts     # Combat state (minions, initiative, etc.)
│       ├── spellbookSlice.ts  # Spell management
│       └── persistenceMiddleware.ts  # Auto-save to sessionStorage
├── components/
│   ├── layout/               # AppShell, Dock, BackgroundVideo
│   ├── widgets/              # HealthWidget, SpellSlotsWidget, etc.
│   ├── views/                # CombatView, RestView, BiographyView
│   ├── features/             # Feature-specific components
│   ├── minions/              # MinionDrawer component
│   ├── ui/                   # Reusable UI components
│   ├── SessionPicker.tsx     # Session management
│   └── ErrorBoundary.tsx     # Error handling wrapper
├── utils/                    # Helper functions
│   ├── srdRules.ts           # D&D 5e rules implementation
│   ├── spellRules.ts         # Spell mechanics
│   ├── spellSlotCalculator.ts # Multiclass spell slot calculation
│   └── sessionStorage.ts     # Session persistence utilities
├── schemas/                  # Zod validation schemas
├── types/                    # TypeScript type definitions
├── data/                     # Static game data
├── hooks/                    # Custom React hooks
├── engine/                   # Game logic engine
├── assets/                   # Images, fonts
└── test/                     # Test files (*.test.tsx, *.test.ts)
```

### Configuration Files (Root)
- **package.json** - Dependencies and scripts
- **vite.config.ts** - Vite bundler + PWA plugin configuration
- **vitest.config.ts** - Test runner configuration
- **eslint.config.js** - ESLint 9 flat config
- **tsconfig.json** - TypeScript project references
- **tsconfig.app.json** - App-specific TypeScript settings (strict mode enabled)
- **tsconfig.node.json** - Node scripts TypeScript settings
- **postcss.config.js** - PostCSS with Tailwind 4 and autoprefixer
- **capacitor.config.ts** - Capacitor mobile app configuration
- **firebase.json** - Firebase Hosting config (deploys `dist/` to aramancia-tracker site)
- **.firebaserc** - Firebase project ID
- **preflight.sh** - Pre-commit validation script

### State Management Pattern
**Redux Toolkit** with three slices:
1. **character** - Character sheet data (HP, stats, spell slots, attunement)
2. **spellbook** - Known spells, prepared spells
3. **combat** - Combat-specific state (minions, concentration, initiative)

**Persistence:** `persistenceMiddleware` auto-saves state to `sessionStorage` on every action. Sessions are loaded via `SessionPicker` component.

### Key Implementation Details
- **D&D Rules:** Strict SRD 5.1 compliance in `src/utils/srdRules.ts`
  - Temporary HP doesn't stack (choose higher)
  - Mage Armor sets base AC to 13 + DEX (mutually exclusive with armor)
  - Shield spell adds +5 AC (stacks with base)
  - Concentration limited to one spell, CON save DC = max(10, damage/2)
  - Attunement hard limit: 3 items
- **Testing:** Vitest with React Testing Library, jsdom environment
- **Styling:** Tailwind 4 with custom theme in `index.css`
- **Icons:** Lucide React library
- **PWA:** Service worker registration via vite-plugin-pwa

### Known Type Issues to Avoid
The `Minion` type is defined differently in two places:
- `src/types/index.ts` - Has `notes` field, `hp: {current, max}` structure
- `src/store/slices/combatSlice.ts` - Has `maxHp`, `speed`, `attacks`, `conditions` fields, different HP structure

When working with minions, be aware of this discrepancy. Do not modify these interfaces without resolving all usages.

## Development Guidelines

### Making Changes
1. **Always** run `npm install` first if package.json or package-lock.json changed
2. **Before coding:** Run `npm run lint` and `npx tsc --noEmit` to establish baseline
3. **After changes:** Run linter immediately, then type check, then relevant tests
4. **Testing:** Use `npm run test:watch` for TDD workflow
5. **Don't break existing tests** (except the 4 known failing ones) - currently 56/60 pass
6. **Dev server:** Keep `npm run dev` running for hot reload during UI changes

### Common Pitfalls
- **Build fails?** Check TypeScript errors first with `npx tsc --noEmit`
- **Tests fail?** Ensure components using Redux hooks are wrapped in `<Provider>`
- **Type errors?** Don't use `any` - use proper types from `src/types/index.ts`
- **Capacitor warnings?** Expected on Node 20, safe to ignore unless targeting Android build

### File Organization Convention
- **Components:** One component per file, named exports for main component
- **Tests:** Co-located in `src/test/`, filename matches component name
- **Types:** Centralized in `src/types/index.ts`, import as needed
- **Utilities:** Pure functions in `src/utils/`, well-documented with JSDoc

## Trust These Instructions
These instructions have been validated by running all commands and exploring the codebase thoroughly. Only search for additional information if:
- A command documented here fails in an unexpected way
- You need details about a specific component not covered here
- The issue explicitly requires understanding code paths not described above

When in doubt, refer back to this file first before extensive exploration.
