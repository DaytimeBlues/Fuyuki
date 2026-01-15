# Fuyuki Vision: The "Best of the Best" Ecosystem

This map visualizes the integration of every system discussed across our technical planning sessions.

```mermaid
mindmap
  root((Fuyuki Pro))
    Core Architecture
      React 19 / Vite 7 / TS
      Redux Toolkit (RTK)
      Zod Schema Validation
      Debounced Persistence
    Warlock Logic (RAW)
      Pact Magic Slots
      Mystic Arcanum Tracking
      Eldritch Invocations
      Ritual List Management
      Spell Save DC Auto-Calc
    Pro Automation
      Concentration Check Middleware
      Damage-Triggered CON Saves
      Bulk Minion Roll Engine
      Negative HP Death Save Reset
    Native (Mobile)
      Capacitor Bridge
      Haptic Feedback Engine
      AR Portrait Effect Overlay
      AMOLED Charcoal Theme
    Aesthetic (Kyoto Noir)
      Banana Gold (#FFD700)
      High-Contrast Minimalism
      Staggered UI Animations
      Parchment Texture Accents
    Developer UX
      Preflight Validation Script
      AI LLM Directives
      Fuzz/Property testing
```

## Data Flow: The Concentration Middleware

```mermaid
sequenceDiagram
    participant User
    participant Slice as Redux characterSlice
    participant Middle as Concentration Middleware
    participant UI as Toast/Modal System

    User->>Slice: Updates HP (Damage Event)
    Slice->>Middle: Intercepts hpChanged Action
    Middle-->>Middle: Calc DC: max(10, damage/2)
    Middle->>UI: Trigger "Roll CON Save" Toast
    UI->>User: Display DC [X] for [Spell Name]
    Note right of User: User rolls physical dice or in-app
```

> [!TIP]
> **Best of the Best Policy**: We prioritize **Mechanical Speed**. Every tap counts. If an automation (like the Concentration DC) can save a user 5 seconds of math, it is a priority 1 feature.
