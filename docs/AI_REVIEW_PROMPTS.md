# Aramancia Tracker: Technical Review Package

## Overview
This document provides a comprehensive technical rundown of the Aramancia D&D 5e Character Tracker application, with prompts for external AI tools to review and analyze the remaining implementation phases.

**Repository**: https://github.com/DaytimeBlues/aramancia-tracker
**Live Demo**: https://aramancia-tracker.web.app

---

## Current Architecture

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite 7.2
- **Styling**: TailwindCSS 4
- **Storage**: localStorage (session-based)
- **Deployment**: Firebase Hosting

### Key Files
```
src/
├── App.tsx                    # Main app, state management
├── types/index.ts             # TypeScript interfaces
├── data/
│   ├── initialState.ts        # Default Level 5 Wizard
│   └── undeadStats.ts         # Summon Undead stat blocks
├── components/
│   ├── SessionPicker.tsx      # Session create/continue
│   ├── layout/
│   │   ├── AppShell.tsx       # Header, nav, layout
│   │   └── BackgroundVideo.tsx # Gothic static background
│   ├── widgets/
│   │   ├── HealthWidget.tsx   # HP with red at ≤10
│   │   ├── SpellSlotsWidget.tsx
│   │   └── ...
│   └── views/
│       ├── CombatView.tsx     # Undead horde, collapsible summons
│       └── ...
└── utils/
    └── sessionStorage.ts      # Session CRUD operations
```

---

## Completed Phases

### Phase 1-3 Summary
| Feature | Status |
|---------|--------|
| Level 5 Wizard stats | ✅ |
| HP bar red at ≤10 | ✅ |
| Mobile nav fix | ✅ |
| Collapsible Summon Undead | ✅ |
| Session persistence | ✅ |

---

## Remaining Phases

### Phase 4: Editable Stats with Cascade
**Goal**: Allow editing character level/abilities in Settings with automatic recalculation.

**Required Cascade Logic (SRD 5.1)**:
```
Level Change →
  ├── Proficiency Bonus: Math.floor((level - 1) / 4) + 2
  ├── Spell Slots: Full caster table lookup
  ├── Hit Dice Max: level
  └── Max HP: (level - 1) * (hit die avg + CON mod) + hit die max + CON mod

Ability Score Change →
  ├── Modifier: Math.floor((score - 10) / 2)
  ├── Skill modifiers
  └── Spell Save DC: 8 + prof + spellcasting mod
```

### Phase 5: SRD Flavor Text
**Goal**: Enhance spell/summon displays with DM-facing guidance from SRD 5.1.

---

## AI Review Prompts

### For Cursor AI

```
Analyze the Aramancia Tracker React/TypeScript codebase for Phase 4 implementation.

CONTEXT:
- D&D 5e character tracker, Necromancer (Level 5 Wizard)
- Needs editable stats with cascade logic per SRD 5.1

TASKS:
1. Review src/types/index.ts CharacterData interface
2. Propose CharacterEditor.tsx component structure
3. Implement utils/srdRules.ts with:
   - getProfBonus(level: number): number
   - getSpellSlots(level: number): Record<number, {used: number, max: number}>
   - calculateMod(score: number): number
4. Suggest state update pattern in App.tsx for cascade effects
5. Identify edge cases (multiclass, ability score caps)

OUTPUT: Code snippets with TypeScript types and tests.
```

---

### For OpenAI Codex

```
# D&D 5e SRD Rules Implementation

## Task
Implement TypeScript utility functions for D&D 5e character stat calculations.

## Requirements
1. Proficiency bonus by level (1-20)
2. Full caster spell slots by level
3. Ability modifier calculation
4. Max HP calculation for Wizard (d6 hit die)

## Constraints
- Follow SRD 5.1 exactly
- Pure functions, no side effects
- Include JSDoc comments
- Export as ES modules

## Expected Output
```typescript
// utils/srdRules.ts
export function getProfBonus(level: number): number
export function getFullCasterSlots(level: number): Record<number, number>
export function getAbilityMod(score: number): number
export function calculateMaxHP(
  level: number,
  hitDieSize: number,
  conMod: number
): number
```

Generate complete implementation with unit tests.
```

---

### For Z.ai

```
SYSTEM: You are a D&D 5e rules expert and React/TypeScript architect.

TASK: Design a character stat editor component for a D&D tracker app.

CURRENT STATE:
- CharacterData type with abilities, level, profBonus, hp, hitDice, slots
- Settings tab exists but needs editor UI
- State managed via useState in App.tsx

REQUIREMENTS:
1. Inline editing for level (1-20) and each ability score (3-20)
2. When level changes: auto-update profBonus, hit dice max, spell slots
3. When ability changes: auto-update modifier, recalc derived stats
4. Visual feedback for changes
5. Mobile-first responsive design

CONSTRAINTS:
- Must match existing gothic monochrome theme
- Use existing btn-fantasy and card-parchment CSS classes
- Persist changes to active session

DELIVERABLES:
1. Component tree diagram
2. State update flow
3. Key code snippets
```

---

### For Deepseek Coder

```
<task>
Implement Phase 4 of Aramancia D&D Tracker: Editable character stats with cascade.
</task>

<context>
React 18 + TypeScript + TailwindCSS app.
Current files:
- src/types/index.ts: CharacterData interface
- src/App.tsx: Main state, setData useState hook
- src/data/initialState.ts: Default Level 5 Wizard
</context>

<requirements>
1. Create CharacterEditor component for Settings tab
2. Create srdRules.ts utility with SRD 5.1 calculations
3. Update App.tsx with handleLevelChange and handleAbilityChange
4. Both functions must cascade updates to derived stats
5. Run npm run build - must pass with no errors
</requirements>

<srd_reference>
Proficiency: +2 (L1-4), +3 (L5-8), +4 (L9-12), +5 (L13-16), +6 (L17-20)
Ability Mod: floor((score - 10) / 2)
Wizard HP: (level * (3.5 + CON mod)) + 3.5 + CON mod (first level max)
</srd_reference>

<output_format>
Provide complete code files ready to paste.
</output_format>
```

---

## Usage

1. Copy the relevant prompt for your AI tool
2. Paste with the current codebase context
3. Review generated code for SRD 5.1 compliance
4. Integrate and test

---

## Repository Location
This file: `docs/AI_REVIEW_PROMPTS.md`
