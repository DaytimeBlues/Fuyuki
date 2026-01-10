# Work Log

Chronological history of development sessions. Updated via `/cleanup` command.

---

## 2026-01-09 [Aramancia] - Short Rest & Performance Optimization
- Implemented Short Rest with Hit Dice spending (full RAW compliance)
- Created HitDiceWidget component with roll animation
- Updated RestView with Short Rest UI flow
- Long Rest now recovers half hit dice (min 1, rounded up)
- Selective useCallback merge from copilot branch (safe handlers only)

**Key Decisions:**
- Hit dice: d6 for Wizard, roll + CON mod healing
- Did NOT wrap updateHealth/addMinion (complex toast dependencies)
- showToast declared early so other callbacks can depend on it

→ Next: Implement Massive Damage rule or Nat 1/20 death saves

---

## 2026-01-09 [Aramancia] - Critical Fixes & Code Review
- Completed full code and logic review of entire codebase
- Fixed 5 critical issues directly to master

**Fixes Implemented:**
1. State persistence via localStorage (character + minions)
2. SpellSlotsWidget DC now dynamic (was hardcoded to 14)
3. Mage Armor label corrected from "(+2)" to "(13+DEX)"
4. Death saves auto-reset when healed from 0 HP (RAW)
5. Concentration auto-clears when HP drops to 0 (RAW)

**Key Decisions:**
- CON save DC uses total damage (common ruling), added clarifying comment
- Persistence uses two keys: character state + minions separately

→ Next: Implement Short Rest functionality (Hit Dice spending)

---

## 2026-01-09 [Aramancia] - Morphic System Implementation
- Implemented Morphic Programming system for agent-assisted development
- Created core files: `AGENT.md`, commands (prime, cleanup, abstract, build-feature)
- Established context structure: system preferences, project-specific context
- Set up logging infrastructure

**Key Decisions:**
- Integrated Morphic System into existing `.agent/` folder
- Preserved existing `GEMINI.md` and `workflows/` for backward compatibility
- Structured for multi-project support (future: math-omni, dictaphone)

→ Next: Test the system by running `/prime-agent aramancia`

---

<!-- Template for new entries:

## [YYYY-MM-DD] [Project] - Brief Title
- Work completed item 1
- Work completed item 2
- Decisions made

**Issues:** (if any)
- Issue description

→ Next: Single most important task

-->
