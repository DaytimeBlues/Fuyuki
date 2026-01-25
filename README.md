# Fuyuki | D&D 5e Warlock Tracker

A minimalist warlock character tracker PWA with SRD 5e compliance. Japanese-inspired Kyoto design aesthetic.

## Features

- **Pact Magic** - Track 1-3 pact slots with short rest recharge
- **Mystic Arcanum** - 6th-9th level spells (1/long rest each)
- **Eldritch Invocations** - Toggle passives, track limited uses
- **Concentration** - Single spell limit with CON save DC
- **HP Management** - Current, Max, Temp HP with d8 hit dice
- **Rest System** - Short rest restores pact slots, long rest full recovery
- **Tactical Advisory Layer** - Intelligent combat recommendations based on spell history, HP, and resource management
- **Enhanced Haptic Feedback** - Tactile feedback for death saves, concentration, minion damage, and spell casting

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Redux Toolkit
- Tailwind CSS 4
- Vitest
- Firebase Hosting
- Capacitor (Android)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Preflight checks (manual)
./preflight.sh

# Finish phase (Automated: Preflight -> Commit -> Push)
./finish.sh "feat(ui): your message here"
```

## CI/CD & Deployment

- **GitHub Actions**: Automated linting, testing, and deployment to GitHub Pages.
- **Workflow**: Pushes to `master` automatically trigger `Deploy to GitHub Pages` workflow.

## Tactical Advisory Layer

The Tactical Advisor analyzes combat state and provides intelligent recommendations:

### Features
- **Real-time Analysis**: Monitors HP, spell slots, concentration status, and casting patterns
- **Priority System**: Recommendations are color-coded by urgency
  - 🔴 Critical (Red): Immediate action required (HP ≤25%)
  - 🟠 High (Orange): Strongly recommended (HP ≤50%)
  - 🟡 Medium (Yellow): Consider this action (low spell slots)
  - 🔵 Low (Blue): Optional suggestion (high-level slots available)
- **Spell History Tracking**: Last 10 spell casts with timestamps
- **Actionable Suggestions**: Specific actions with details (cast, rest, heal, condition)
- **Dismissible**: Individual recommendations can be dismissed
- **Clear History**: Reset spell cast history for new combat scenarios

### Usage
1. Navigate to Combat view
2. Recommendations appear in Tactical Widget (Combat view, right panel)
3. Click any recommendation to view action details
4. Click × to dismiss individual recommendations
5. Click × in header to clear entire history

### Example Recommendations
- "Critical HP Warning: 9/38 HP. Immediate healing or retreat required."
- "HP Low: 19/38 HP. Consider healing or defensive tactics."
- "Spell Slots Depleted: Level 1 slots empty. Short rest recommended."
- "Concentration at Risk: Maintaining Hold Person while HP is critical."
- "Aggressive Casting Pattern: 3 damage spells cast recently. Consider utility spells."
- "High-Level Slots Available: Level 4 slots ready. Consider powerful spells."

## Haptic Feedback System

Enhanced tactile feedback throughout combat:

### Death Save Haptics
- **First save**: Medium notification tap
- **Third failure**: Heavy warning (double pulse)
- **Third success**: Healing success pattern
- **Character death**: Critical warning pattern

### Concentration Haptics
- **Concentration broken**: Warning haptic

### Combat Haptics
- **Critical minion damage** (10+ damage): Heavy haptic (critical hit feel)
- **Normal minion damage** (<10 damage): Medium haptic (normal hit)
- **Spell cast**: Medium haptic impact

### Platform Support
- Web: Uses Vibration API (navigator.vibrate)
- Mobile (Capacitor): Uses native haptics
- Graceful degradation to no-op on unsupported platforms

## D&D 5e Warlock Rules (SRD 5.1)

| Mechanic | Implementation |
|----------|---------------|
| Pact Slots | 1-3 slots, level 1-5, short rest recharge |
| Spellcasting | CHA-based, DC = 8 + prof + CHA mod |
| Mystic Arcanum | 6/7/8/9th level at 11/13/15/17, 1/long rest each |
| Concentration | One spell max, CON save DC = max(10, damage/2) |
| Hit Dice | d8, restored on long rest, current = level |

*Forked from [aramancia-tracker](https://github.com/DaytimeBlues/aramancia-tracker)*
