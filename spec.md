# Fuyuki Warlock Tracker: System Specification ("The Brain")

> **Living Document** - Do not modify without maintaining consistency across `vision_mindmap.md` and `technical_rundown.md`.

## 1. Product Intent
**Fuyuki** is a "Best-in-Class" Progressive Web App (PWA) designed specifically for high-level **Warlock/Necromancer** play in Dungeons & Dragons 5th Edition.

- **Core Philosophy:** "Mental Load Reduction." The app handles the math (DC calculations, HP tracking, Minion rolls) so the player can focus on the roleplay.
- **Target Audience:** Technical D&D players who value aesthetics, speed, and RAW (Rules as Written) compliance.
- **Vibe:** "Kyoto Noir" - A fusion of traditional Japanese minimalism (parchment, gold) and futuristic dark mode (AMOLED black, neon accents).

## 2. Design System: "Kyoto Noir"

### Color Palette
- **Void (Background):** `#000000` (AMOLED) / `#0a0a0b` (Deep Charcoal)
- **Banana Gold (Accent):** `#FFD700` (Primary Action / Highlights)
- **Vermillion (Danger):** `#c53d3d` (Damage / Death / Combat)
- **Parchment (Content):** `#d4c4b0` (Text / Borders)
- **Muted (Secondary):** `#71717a` (Metadata / Inactive)

### Typography
- **Headings:** `Outfit` (Modern, geometric sans-serif) - Tracking: `0.2em` (Wide)
- **Body:** `Inter` (Clean, legible sans-serif)
- **Data/Numbers:** `Monospace` (for tabular alignment)

### Interaction Design
- **Miller’s Law:** Dashboard chunks info into max 7 groups (Vitals, Resources).
- **Hick’s Law:** Contextual menus (Combat Mode) show only relevant actions.
- **Haptics:** Physical feedback for all state-changing actions (Damage, Casting).
- **Motion:** Staggered entrances (`stagger-1`...`stagger-5`) and smooth page transitions (`fade-in`, `slide-up`).

## 3. Architecture & Tech Stack

### Foundation
- **Framework:** React 19 + TypeScript 5.x
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 (Vanilla CSS variables for theme)
- **Icons:** Lucide React

### State Management ("The Flux")
- **Store:** Redux Toolkit (Single Source of Truth)
- **Slices:**
  - `characterSlice`: HP, Slots, Stats, Inventory.
  - `combatSlice`: Initiative, Rounds, Minions.
- **Persistence:** Redux Listener Middleware -> `localStorage` (Debounced 500ms).
- **Validation:** Zod schemas enforce data integrity on hydration.

### Project Structure (The "System Image")
```
src/
├── components/
│   ├── layout/          # AppShell, Dock
│   ├── views/           # Full-page containers (Dashboard, Combat, CharacterHub)
│   ├── widgets/         # Atomic functional units (HealthWidget, SpellSlots)
│   └── ui/              # Reusable design tokens (Button, Card, Modal)
├── data/
│   ├── spells.ts        # SRD Spell Database
│   └── rules.ts         # RAW Mechanics (AC formulas, DC calc)
├── store/               # Redux logic
└── types/               # TypeScript definitions
```

## 4. Key Workflows

### A. The "Dashboard" (Home)
- **Purpose:** At-a-glance combat readiness.
- **Components:** Health (Circular), Concentration (Dynamic), Death Saves (Condition-based), Pact Slots (Gold Orbs).

### B. Minion Management (Combat View)
- **Purpose:** Managing "Undead Hordes" without slowing down table play.
- **Features:**
  - Bulk Rolling (Attack/Damage).
  - Virtualized List (TanStack Virtual) for performance with 50+ minions.
  - Quick-Health adjustments.

### C. The "Hub" (Character View)
- **Purpose:** Deep reference / downtime.
- **Sub-views:**
  - Biography (Roleplay notes).
  - Attributes (Skills, Saves).
  - Grimoire (Spell knowledge base).

## 5. Coding Standards ("The Vibe Coder")
1.  **Don't Make Me Think:** If a component is complex, break it down.
2.  **Visual Excellence:** No default scrollbars. No unstyled inputs. Every pixel matters.
3.  **Safety First:** No state mutations outside Redux actions.
4.  **Type Safety:** No `any`. Define interfaces in `src/types`.
