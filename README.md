# Fuyuki | D&D 5e Warlock Tracker

A minimalist warlock character tracker PWA with SRD 5.1 compliance. Japanese-inspired Kyoto design aesthetic.

## Features

- **Pact Magic** - Track 1-3 pact slots with short rest recharge
- **Mystic Arcanum** - 6th-9th level spells (1/long rest each)
- **Eldritch Invocations** - Toggle passives, track limited uses
- **Concentration** - Single spell limit with CON save DC
- **HP Management** - Current, Max, Temp HP with d8 hit dice
- **Rest System** - Short rest restores pact slots, long rest full recovery

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
- **Workflow**: Pushes to `master` automatically trigger the `Deploy to GitHub Pages` workflow.

## D&D 5e Warlock Rules (SRD 5.1)

| Mechanic | Implementation |
|----------|----------------|
| Pact Slots | 1-3 slots, level 1-5, short rest recharge |
| Spellcasting | CHA-based, DC = 8 + prof + CHA mod |
| Mystic Arcanum | 6/7/8/9th level at 11/13/15/17, 1/long rest |
| Concentration | One spell max, CON save DC = max(10, damage/2) |

---

*Forked from [aramancia-tracker](https://github.com/DaytimeBlues/aramancia-tracker)*
