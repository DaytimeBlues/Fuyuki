# Aramancia Tracker - Project Context

## Overview
A D&D 5e character tracker PWA for the character "Aramancia" - a Wizard focused on necromancy and utility magic.

## Character Stats (Current)
| Stat | Value |
|------|-------|
| Level | 5 (Wizard) |
| HP | 35/35 |
| Base AC | 13 (Studded Leather) |
| Spell Save DC | 14 |
| Proficiency | +3 |

### Ability Scores
| Ability | Score | Mod |
|---------|-------|-----|
| STR | 8 | -1 |
| DEX | 14 | +2 |
| CON | 14 | +2 |
| INT | 20 | +5 |
| WIS | 15 | +2 |
| CHA | 10 | +0 |

### Spell Slots
- 1st: 4 slots
- 2nd: 3 slots
- 3rd: 2 slots

## Tech Stack
- **Framework:** React 19.2 + TypeScript 5.9
- **Build:** Vite 7.2
- **Styling:** Tailwind CSS 4.1
- **Icons:** Lucide React
- **Hosting:** Firebase Hosting
- **PWA:** Service Worker + Manifest

## Architecture

### State Management
- All state lives in `App.tsx`
- Passed down via props (no Context/Redux)
- Character data initialized from `src/data/initialState.ts`

### Component Structure
```
src/
├── App.tsx              # Main state & routing
├── components/
│   ├── layout/          # AppShell, Dock, BackgroundVideo
│   ├── widgets/         # Reusable stat blocks
│   │   ├── HealthWidget
│   │   ├── ArmorClassWidget
│   │   ├── SpellSlotsWidget
│   │   ├── DeathSavesWidget
│   │   ├── ConcentrationWidget
│   │   ├── AttunementWidget
│   │   ├── InventoryWidget
│   │   └── WildShapeWidget
│   ├── views/           # Full-page views
│   │   ├── SpellsView
│   │   ├── CombatView
│   │   ├── RestView
│   │   ├── GrimoireView
│   │   └── BiographyView
│   └── minions/         # Undead management
└── data/
    ├── initialState.ts  # Character defaults
    ├── spells.ts        # Spell definitions
    └── undeadStats.ts   # Minion templates
```

## Key Features Implemented
- [x] HP tracking with THP (RAW compliant)
- [x] AC calculation (Mage Armor + Shield stacking)
- [x] Spell slot management
- [x] Death saves
- [x] Concentration tracking with CON save prompts
- [x] Attunement (max 3 items)
- [x] Minion management (Skeletons, Zombies)
- [x] Wild Shape with carryover damage
- [x] Short/Long rest automation
- [x] Multiclass spell slot calculator

## D&D Rules Implemented
| Rule | Status | Notes |
|------|--------|-------|
| THP doesn't stack | ✅ | Choose higher value |
| THP absorbs damage first | ✅ | Before regular HP |
| Mage Armor base | ✅ | 13 + DEX (mutually exclusive) |
| Shield stacks | ✅ | +5 on top of base |
| Concentration limit | ✅ | One spell max |
| CON save for damage | ✅ | DC = max(10, dmg/2) |
| Max 3 attunement | ✅ | Hard limit enforced |

## Known Issues / TODOs
- [x] ~~Persist state to localStorage/Firebase~~ (Done: localStorage)
- [ ] Short Rest functionality (Hit Dice spending)
- [ ] Massive Damage instant death rule
- [ ] Natural 1/20 death save handling
- [ ] Add more spell definitions
- [ ] Implement spell preparation system
- [ ] Add conditions/status effects
- [ ] Header level/class from state (currently hardcoded)

## Development Commands
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Recent Changes
- **2026-01-09**: Critical fixes - localStorage persistence, dynamic DC, RAW compliance (death saves reset, concentration auto-clear)
- **2026-01-09**: Morphic System implementation

---
*Last updated: 2026-01-09*
