# Single-player D&D 5e wizard combat sheet: mechanics, resolution flows, and UI/implementation notes

Document date: 12 Jan 2026
Scope: single player character sheet and combat helper for a wizard (not a multi-player/VTT team tool).

Verification note:
- Rules and spell/monster mechanics are cited to the D&D 5e Systems Reference Document (SRD 5.1) and other free official references where available.
- Player's Handbook (PHB) citations that appeared earlier in conversation are not independently verified here (PHB text is not freely accessible). Where the SRD covers the same rule, SRD citations are used.

## 1. Core numbers and where they come from (wizard spellcasting math)

### 1.1 Ability modifier (general rule)
An ability modifier is derived from the relevant ability score and is used in many rolls (attack rolls, saving throws, ability checks, and spellcasting formulas). (SRD 5.1, Ability Scores, p. 76)

### 1.2 Proficiency bonus (general rule)
Your proficiency bonus increases by level and is added when you are proficient (including spell attacks and your spell save DC formulas). (SRD 5.1, Proficiency Bonus, p. 77; also see free rules summary tables on D&D Beyond)

### 1.3 Wizard spell attack bonus
When a spell tells you to make a spell attack roll, your wizard uses Intelligence as the spellcasting ability, and the spell attack bonus is:
spell attack bonus = proficiency bonus + Intelligence modifier
(SRD 5.1, Wizard - Spellcasting, p. 53)

### 1.4 Wizard spell save DC
When a spell forces a target to make a saving throw, the DC is:
spell save DC = 8 + proficiency bonus + Intelligence modifier
(SRD 5.1, Wizard - Spellcasting, p. 53)

### 1.5 Prepared spells (wizard)
A wizard prepares a daily list of spells from their spellbook, based on wizard level and Intelligence modifier.
(SRD 5.1, Wizard - Preparing and Casting Spells, p. 53)

## 2. The three spell-resolution patterns (what gets rolled, and by whom)

Most spell resolution fits one of these patterns.

### 2.1 Pattern A: spell attack roll (you roll to hit)
Trigger text: the spell says you make a melee spell attack or ranged spell attack.

Flow:
1) You roll d20 and add your spell attack bonus.
2) Compare to the target's AC.
3) If total >= AC: the spell hits and you apply the on-hit effects.
4) If total < AC: the spell misses and normally does nothing (unless the spell text says otherwise).
(SRD 5.1, Casting a Spell - Attack Rolls, p. 103; SRD 5.1, Combat - Making an Attack, p. 94)

### 2.2 Pattern B: saving throw (they roll to resist)
Trigger text: the spell says the target must make a saving throw (Dexterity save, Wisdom save, etc.).

Flow:
1) You present the target with your spell save DC.
2) The target rolls d20 and adds their saving throw modifier.
3) If the total < your DC: the target fails and suffers the failure effect.
4) If the total >= your DC: the target succeeds and suffers the success effect (often half damage or no effect).
(SRD 5.1, Saving Throws, p. 83; SRD 5.1, Casting a Spell - Saving Throws, p. 103)

### 2.3 Pattern C: no attack roll and no saving throw (automatic effect)
Trigger text: the spell text does not call for an attack roll or a save, and it states the effect happens (example: "hits" or "appears").

Flow:
1) Apply the spell's effect as written.
2) Roll only the damage or other variable components the spell specifies.
Example: Magic Missile's darts "hit" automatically. (SRD 5.1, Magic Missile, p. 161)

## 3. Concentration (how it is tracked)

Many spells require concentration. Important mechanical constraints:
- You can concentrate on only one spell at a time. Starting a new concentration spell ends the previous one.
- If you take damage while concentrating, you must make a Constitution saving throw to maintain concentration. The DC is 10 or half the damage taken (whichever is higher).
(SRD 5.1, Concentration, pp. 101-102)

App tracking implications:
- Concentration should be a state with (spell, start time, duration remaining, and maintenance checks).
- A damage event should prompt a concentration check for the current concentration spell (if any).

## 4. Worked, sourced examples of spells resolving in play

The examples below are directly mapped to SRD spell text.

### 4.1 Ray of Frost (Pattern A: spell attack roll)
Spell text includes: make a ranged spell attack; on a hit, deal cold damage and reduce speed. (SRD 5.1, Ray of Frost, p. 174)

Resolution steps in play:
1) Roll d20 + your spell attack bonus.
2) Compare to target AC.
3) On hit: roll 1d8 cold damage and apply speed reduction until the start of your next turn.

### 4.2 Fireball (Pattern B: saving throw)
Spell text includes: targets make a Dexterity saving throw; failed save takes full damage, successful save takes half. (SRD 5.1, Fireball, p. 144)

Resolution steps in play:
1) Present your spell save DC.
2) Each creature in the area rolls d20 + Dex save modifier.
3) Failed: take 8d6 fire damage.
4) Success: take half damage.

### 4.3 Magic Missile (Pattern C: automatic hit)
Spell text includes: you create darts; each dart hits a creature of your choice; roll damage per dart. (SRD 5.1, Magic Missile, p. 161)

Resolution steps in play:
1) Choose targets for each dart.
2) No attack roll; no save.
3) Roll 1d4 + 1 per dart and apply damage.

### 4.4 Hold Person (Pattern B + concentration)
Spell text includes: humanoid target makes a Wisdom saving throw; on failure, paralyzed; the spell requires concentration. (SRD 5.1, Hold Person, p. 154; SRD 5.1, Appendix PH-A: Conditions (Paralyzed), p. 358; SRD 5.1, Concentration, pp. 101-102)

Resolution steps in play:
1) Present your spell save DC; target rolls Wisdom saving throw.
2) Failure: apply Paralyzed condition.
3) Track concentration for up to 1 minute; prompt concentration checks on damage.

## 5. Summons and controlled creatures (single-player support)

### 5.1 Animate Dead (wizard necromancy)
Animate Dead creates a skeleton or zombie from a corpse or pile of bones, and the spell describes how you maintain control via re-casting the spell and issuing commands. (SRD 5.1, Animate Dead, p. 115)

App tracking implications:
- Each controlled undead needs its own combat card (HP, AC, attacks, conditions) and a control timer (when control expires if relevant).
- Each undead should have a simple "decision loop" UI for its turn: choose action -> choose target -> roll -> apply.

### 5.2 Skeleton and zombie stat blocks (for quick rolling)
Skeleton and zombie stat blocks (including their listed actions) are available in the free Basic Rules on D&D Beyond. (D&D Beyond Basic Rules 2014, Monster Stat Blocks - S (Skeleton); D&D Beyond Basic Rules 2014, Monster Stat Blocks - Z (Zombie))

Practical UI implication:
- For each undead, expose 1-tap actions that bundle attack roll + damage roll, using the stat block's modifiers and dice.

## 6. App patterns observed in existing D&D digital tools (single-player relevant)

The goal here is not to copy UI, but to copy interaction patterns that reduce cognitive load.

### 6.1 Auto-calculated derived values (spell DC, spell attack, to-hit, saves)
Roll20's D&D 5e sheet documentation describes auto-calculation of attributes, saves, AC, to-hit, damage, spell attacks, and spell DC based on sheet data and equipped items. (Roll20 Help Center, D&D 5E by Roll20, updated 4 Sept 2023)

D&D Beyond's sheet sections documentation describes a Spells section where prepared spells can be viewed and expanded to display details and quick info like Save DC and type. (D&D Beyond Support, Sheet Sections, updated 17 Sept 2025)

Design pattern:
- Display computed values (spell attack bonus, spell save DC, key save modifiers) next to the controls that use them.
- Make all computed values inspectable: tapping/clicking shows the formula breakdown.

### 6.2 Combat tracker interaction: "roll initiative" and per-turn widgets
Foundry VTT's combat tracker documentation shows an interaction model where a user can roll initiative via a die icon in a combat tracker row. (Foundry VTT, Combat Tracker article)

Design pattern:
- Represent each actor (wizard + minions) as a turn row/card with primary actions: roll initiative, set current HP, apply condition, roll common actions.

### 6.3 Mobile-first single-character apps: one-tap rolls and equipment toggles
Fight Club 5th Edition store listings describe a dice roller for stats and attacks, and equipping/unequipping gear with automatic updates to derived values. (Apple App Store listing for Fight Club 5th Edition; Google Play listing for Fight Club 5th Edition)

Design pattern:
- Every commonly used combat operation should be doable from one screen with one tap, or one tap plus one short selection (target, slot, or spell level).

## 7. Human factors (the "psychology" of how people use the sheet while playing)

This section cites established human-computer interaction (HCI) principles; it is about reducing mistakes and friction at the table.

### 7.1 Recognition rather than recall
UI that keeps key options visible reduces memory load. (Nielsen Norman Group, 10 Usability Heuristics; Nielsen Norman Group, Recognition and Recall in UI)

Direct application:
- Show the three spell-resolution modes as explicit buttons: Attack, Save, Automatic.
- Show a compact "math strip": spell attack bonus, spell save DC, proficiency bonus, Int modifier.

### 7.2 Reducing choice overload (Hick's Law)
More choices generally increases decision time; use grouping and progressive disclosure. (Interaction Design Foundation, Hick's Law; Proctor (2018) review on choice reaction time)

Direct application:
- A Favorites bar for your most common actions/spells.
- A Recents list that shows the last 5-10 actions used, for fast repetition.

### 7.3 Large targets and short paths (Fitts's Law)
Target size and distance affect selection time; make frequent actions easy to hit/click. (Nielsen Norman Group, Fitts's Law; Interaction Design Foundation, Fitts's Law)

Direct application:
- Big buttons for "Cast", "Roll attack", "Roll save DC", "Apply damage", and "Concentration check".
- Keep the primary turn-flow actions clustered together.

### 7.4 Cognitive load management
Design should fit within working memory limits and reduce extraneous load. (NSW Centre for Education Statistics and Evaluation, Cognitive load theory paper)

Direct application:
- Avoid showing the entire spell list by default. Show favorites, then search, then full list.
- Use progressive disclosure: a spell row shows a short summary; expanding reveals full details.

## 8. Requirements captured from this conversation (single-player features)

These are requirements stated in conversation; they are not rules claims.

- Single-player sheet (not a party tracker).
- Wizard-focused spell handling that clarifies: attack rolls vs saves vs automatic effects; plus where modifiers come from.
- Summoned/controlled creatures (such as Animate Dead outcomes) need their own decision loops.
- Each decision loop needs a "cancel" control that lets you exit without penalty (an undo/escape hatch).
- Favorites: quick-press access to usual actions/spells (example given: Toll the Dead).

Note on Toll the Dead:
- Toll the Dead is not part of SRD 5.1. It is published in Xanathar's Guide to Everything (and may appear in later rules sets). Because it is not SRD, this document does not reproduce its full spell text. (D&D Beyond forum posts and the Xanathar's source listing identify Toll the Dead as originating from Xanathar's Guide to Everything.)

## 9. Implementation notes (programming model) [Inference]

These are implementation suggestions, not rules.

### 9.1 Data model (minimal)
- Character: ability scores, level, proficiency bonus, HP/AC, conditions.
- DerivedStats: computed values (spell attack bonus, spell save DC, save modifiers).
- Spell: name, level, school, casting time, range, components, duration, concentration flag, resolution mode (Attack/Save/Automatic), and a set of roll macros.
- Resource: spell slots, class features, limited-use items.
- Actor: any entity that can take turns (wizard, summoned creature, animated undead).
- ActionMacro: a structured roll (e.g., "d20 + 6 to hit", "8d6 fire") plus metadata (damage type, target type, DC type).
- CombatState: initiative order, round/turn pointer, active concentration, active effects timers.

### 9.2 Resolution as a state machine
To avoid confusion, model each spell cast as a small state machine:
Select spell -> confirm slot/level -> choose targets/area -> resolve (Attack/Save/Automatic) -> apply effects -> complete
A cancel/undo button can safely return to the previous state without mutating the character sheet until "apply" is pressed.

### 9.3 Decision loop cards for minions
Each controlled creature gets a turn card:
- Choose action (attack, dash, dodge, etc.)
- Choose target
- Roll (attack) and roll (damage)
- Apply damage/effects
- End turn
Provide an always-visible cancel/skip option.

### 9.4 Favorites and quick actions
- Pin actions and spells (favorites).
- Provide a small set of global quick actions: concentration check, death save (if relevant), short rest/long rest bookkeeping.
- Provide search with filters (level, concentration, action type) for the long tail.

## 10. References

Primary rules reference:
- Wizards of the Coast. System Reference Document 5.1 (SRD-OGL_V5.1.pdf). 2016. (Used for: wizard spellcasting formulas; concentration; saving throws; spells Ray of Frost, Fireball, Magic Missile, Hold Person; Animate Dead.)

Free official references used for stat blocks and tool patterns:
- D&D Beyond. Basic Rules (2014). Monster Stat Blocks - S (Skeleton).
- D&D Beyond. Basic Rules (2014). Monster Stat Blocks - Z (Zombie).
- D&D Beyond Support. Sheet Sections. Updated 17 Sept 2025.
- Roll20 Help Center. D&D 5E by Roll20. Updated 4 Sept 2023.
- Foundry Virtual Tabletop. Combat (Combat Tracker article).
- Apple App Store listing: Fight Club 5th Edition (Lion's Den).
- Google Play listing: Fight Club 5th Edition (Lion's Den).
- D&D Beyond. Xanathar's Guide to Everything (source listing).
- D&D Beyond Forums (Bugs & Support). Threads noting that Toll the Dead comes from Xanathar's Guide to Everything.

Human factors references:
- Nielsen Norman Group. 10 Usability Heuristics for User Interface Design.
- Nielsen Norman Group. Recognition and Recall in User Interfaces.
- Nielsen Norman Group. Fitts's Law and Its Applications in UX.
- Interaction Design Foundation. Hick's Law.
- Interaction Design Foundation. Fitts' Law.
- NSW Centre for Education Statistics and Evaluation (NSW Department of Education). Cognitive load theory: Research that teachers really need to understand (PDF).
