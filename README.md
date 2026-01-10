# Aramancia Tracker

A D&D 5e character tracker PWA for tracking HP, AC, spell slots, and combat state with strict RAW (Rules as Written) compliance.

## Features

- **HP Management** - Current, Max, and Temporary HP with proper THP handling (THP absorbs damage first, doesn't stack)
- **AC Calculation** - Base AC with Mage Armor and Shield spell support (proper stacking rules)
- **Spell Slots** - Track usage across all spell levels with multiclass support
- **Concentration** - Single spell limit with automatic CON save DC calculation
- **Death Saves** - Track successes and failures
- **Minion Management** - Raise and track Skeletons and Zombies
- **Wild Shape** - Transform with carryover damage on revert
- **Attunement** - Max 3 items enforced
- **Rest System** - Short and Long rest automation

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Lucide React (icons)
- Firebase Hosting

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

---

## Morphic Programming System

This project uses a **Morphic System** for AI-assisted development. The system treats natural language as a high-level language and the AI as a compiler/runtime.

### Quick Start

When starting a new session with an AI agent (Cursor, Claude, etc.):

```
Read .agent/commands/prime.md and execute it for project aramancia
```

When ending a session:

```
Read .agent/commands/cleanup.md and execute it
```

### Directory Structure

```
.agent/
├── AGENT.md                    # Core identity & directives
├── GEMINI.md                   # Legacy: D&D rules reference
├── commands/                   # Executable instructions
│   ├── prime.md               # Session bootloader
│   ├── cleanup.md             # Session closer & logger
│   ├── abstract.md            # Pattern extraction
│   ├── build-feature.md       # Feature implementation workflow
│   └── test-feature.md        # Testing workflow
├── context/                    # Knowledge base
│   ├── system/
│   │   └── user-preferences.md
│   └── projects/
│       └── aramancia.md       # Project-specific context
├── logs/
│   └── work-log.md            # Session history
└── workflows/                  # Legacy: Test workflows
    ├── test-ac-logic.md
    ├── test-hp-logic.md
    └── test-combat.md
```

### Available Commands

| Command | Purpose |
|---------|---------|
| `/prime-agent [project]` | Initialize session with context |
| `/cleanup` | Save progress, update logs |
| `/abstract [name] "[desc]"` | Create reusable command |
| `/build-feature "[name]"` | Standard feature workflow |
| `/test-feature "[name]"` | Standard testing workflow |

### Benefits

1. **Persistent Context** - State survives across sessions via markdown files
2. **Deterministic Behavior** - Preferences baked into `AGENT.md`, not repeated
3. **Recursive Learning** - Solved problems become reusable commands
4. **Audit Trail** - Work log provides continuity and accountability

---

## D&D 5e Rules Reference

This tracker implements strict SRD 5.1 compliance:

| Mechanic | Implementation |
|----------|----------------|
| Temporary HP | Doesn't stack (choose higher), absorbs damage first |
| Mage Armor | Sets base to 13 + DEX (mutually exclusive with worn armor) |
| Shield Spell | +5 AC (stacks with base) |
| Concentration | One spell max, CON save DC = max(10, damage/2) |
| Attunement | Hard limit of 3 items |
| Death Saves | 3 successes = stabilize, 3 failures = death |

## License

Private project.
