# Technical Rundown: Fuyuki "Pro" (Best-in-Class Warlock Tracker)

**Vision**: A specialized, high-performance PWA/Native hybrid that eliminates "Mental Load" for high-level Warlock and Necromancer play.

---

## 🏗️ 1. Advanced Architecture (The Foundation)

### **State Engine (Redux Toolkit + Listener Middleware)**
- **Centralized Flux**: `characterSlice` is the immutable source of truth for all SRD 5.1 data.
- **Reactive Persistence**: Listener middleware triggers debounced (500ms) writes to `localStorage`.
- **Runtime Safety**: Zod schemas validate every hydration event. If data is corrupted (e.g., manual JSON editing), the app resets to a safe state instead of crashing.

### **Performance Layer**
- **Virtualization**: `tanstack-virtual` handles "Undead Hordes" (MinionList), ensuring 120Hz smooth scrolling even with 50+ skeletons.
- **Atomic Rendering**: Memoized selectors (`reselect`) ensure a change in "Gold" doesn't re-render the "HP" widget.

---

## 🔥 2. "Pro" Automation Features (The Best-of-the-Best)

### **Concentration Middleware**
- **RAW Enforcement**: Whenever a damage event is recorded in the `characterSlice`, the middleware calculates the **CON Save DC** (`max(10, damage/2)`) and triggers a modal prompt. If the save is failed, concentration is cleared automatically.

### **Native Mobile Bridge (Capacitor)**
- **Native Haptics**: Tactical feedback on critical hits, damage intake, and long rests.
- **AR Portrait Overlay**: Use the Capacitor Camera API to overlay "Eldritch" effects (glowing eyes, runic skin) onto user photos for a truly personal character sheet.
- **Native Splash & Biometrics**: Optional biometric lock for private character data.

### **Automated Combat Engine**
- **Minion Bulk Rolls**: An automation layer for rolling attacks and damage for multiple minions simultaneously, reducing table-time for Necromancers.

---

## 🎨 3. Aesthetic: Kyoto Noir / Nano Banana
- **Theme**: High-contrast, AMOLED-optimized Charcoal (`#0a0a0a`) with "**Banana Gold**" (`#FFD700`) accents.
- **Kyoto Minimalism**: Clean, functional lines inspired by traditional Japanese craftsmanship.
- **Motion Design**: Subtle, reduced-motion-aware transitions that guide the user's eye without distracting from numerical data.

---

## 🧪 4. Testing & Reliability
- **Preflight Protocol**: Every commit must pass `./preflight.sh` (Vitest unit tests + TypeScript validation + Linting).
- **Property-Based Testing**: Use `fast-check` to fuzzer test HP and AC logic against edge cases (negative modifiers, multiclassing caps).

---

## 🔮 5. Future AI Integration (Mind-Map Vision)
- **AI DM Assistant**: Integration with Open5e via RTK Query to provide instant rule adjudications and spell descriptions.
- **Voice Commands**: "Long Rest", "Spend Hit Die", or "Cast Fireball" via Web Speech API or native Capacitor bridge.
