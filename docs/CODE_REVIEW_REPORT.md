# Aramancia Tracker - Pre-Port Code Review Report

**Date:** January 10, 2026  
**Reviewer:** Software Architect & Senior Code Reviewer  
**Target Platform:** Nothing Phone (2a) / Android  
**Application Version:** 0.0.0 (Pre-deployment)  
**Status:** ✅ **Agentic Execution Phase Complete** - Critical fixes implemented

---

## Overall Summary

The Aramancia Tracker is a well-architected React 18 + TypeScript application designed for D&D 5e gameplay assistance with a distinct Necromancer theme. The codebase demonstrates **solid fundamentals** with correct SRD 5.1 rule implementations, clean TypeScript typing, comprehensive test coverage (44 tests passing), and a cohesive "Gothic-Parchment" visual design.

### Major Strengths
- ✅ **Correct D&D Rules Implementation**: SRD 5.1 calculations (proficiency bonus, spell slots, HP, spell save DC) are mathematically accurate
- ✅ **Type Safety**: Strong TypeScript usage with well-defined interfaces (`CharacterData`, `Minion`, `Session`)
- ✅ **Test Coverage**: Critical game logic in `srdRules.ts` has thorough unit tests
- ✅ **Responsive Design**: CSS includes breakpoints for various Android screen sizes and safe-area-inset support
- ✅ **Performance Considerations**: Use of `useCallback` for memoization, PWA service worker caching
- ✅ **Accessibility**: Reduced motion support, proper button labels

### ✅ FIXES IMPLEMENTED (Agentic Phase)

| Issue | Status | Commit |
|-------|--------|--------|
| Storage Corruption Risk (JSON.parse without try/catch) | ✅ FIXED | This commit |
| Schema Validation Missing | ✅ FIXED | This commit |
| Main Thread Blocking (no debounce) | ✅ FIXED | This commit |
| `updateHealth` not memoized | ✅ FIXED | This commit |

### Remaining Items
- ⚠️ **No Capacitor/Android Project**: Requires `npx cap add android` (system setup, outside code scope)
- ⚠️ **Memory Consideration**: Large minion arrays could benefit from virtualization (future enhancement)

---

## Detailed Findings

### 1. Rules Logic (SRD 5.1 Correctness)

#### ✅ [Low] Proficiency Bonus Calculation - CORRECT
**File:** `src/utils/srdRules.ts:14-17`  
**Status:** Verified correct per SRD 5.1
```typescript
export function getProficiencyBonus(level: number): number {
    const clampedLevel = Math.max(1, Math.min(20, level));
    return Math.floor((clampedLevel - 1) / 4) + 2;
}
```
The formula `floor((level-1)/4) + 2` correctly produces +2 (L1-4), +3 (L5-8), +4 (L9-12), +5 (L13-16), +6 (L17-20).

#### ✅ [Low] Full Caster Spell Slots - CORRECT
**File:** `src/utils/srdRules.ts:33-54`  
**Status:** The `FULL_CASTER_SLOTS` lookup table accurately matches the SRD 5.1 Spellcasting Table for full casters (Wizard, Cleric, Druid, Bard, Sorcerer).

#### ✅ [Low] Max HP Calculation - CORRECT
**File:** `src/utils/srdRules.ts:98-119`  
**Status:** Correctly implements:
- First level: max hit die + CON modifier
- Subsequent levels: fixed average `floor(hitDieSize/2) + 1` + CON modifier
- Minimum 1 HP per level (RAW interpretation for extreme negative CON)

#### ✅ [Low] Ability Modifier Calculation - CORRECT
**File:** `src/utils/srdRules.ts:25-27`  
**Status:** Standard formula `floor((score - 10) / 2)` is correct.

#### ✅ [Low] Spell Save DC - CORRECT
**File:** `src/utils/srdRules.ts:128-130`  
**Status:** `8 + proficiency bonus + spellcasting modifier` is the correct SRD formula.

---

### 2. React Performance

#### ✅ [FIXED] updateHealth Now Memoized with useCallback
**File:** `src/App.tsx:82-128`  
**Status:** The `updateHealth` function is now properly wrapped in `useCallback` to prevent unnecessary re-renders.

```typescript
const updateHealth = useCallback((newCurrent: number) => {
    setData(prev => {
      const delta = newCurrent - prev.hp.current;
      // ... rest of logic using functional update pattern
    });
  }, [showToast]);
```

#### ✅ [FIXED] Debounced localStorage Writes
**File:** `src/App.tsx:48-68`  
**Status:** localStorage writes are now debounced with 500ms delay to prevent main thread blocking during rapid HP/stat updates.

```typescript
// Debounce timer ref for localStorage writes
const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }
  saveTimeoutRef.current = setTimeout(() => {
    updateActiveSession(data, minions);
  }, 500);
  return () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };
}, [data, minions]);
```

#### ⚠️ [Medium] Large Array Mapping in CombatView
**File:** `src/components/views/CombatView.tsx` and `src/components/minions/MinionDrawer.tsx`  
**Issue:** For players managing large undead hordes (e.g., 40+ minions from high-level Animate Dead), mapping over the entire array on every render could cause performance issues on mobile.

**Suggestion:** Consider implementing windowed/virtualized lists using `react-window` or `tanstack-virtual` if minion counts exceed 20.

#### ✅ [Low] Good Use of useCallback
**File:** `src/App.tsx`  
**Positive:** All handlers (`updateHealth`, `updateTempHP`, `updateAC`, `updateSpellSlot`, `handleSpendHitDie`, `handleLongRest`, etc.) are properly memoized with `useCallback`.

#### ⚠️ [Low] useEffect Without Cleanup for Toast Timeout
**File:** `src/App.tsx:77-80`  
**Issue:** The `showToast` callback uses `setTimeout` but doesn't return a cleanup function. If the component unmounts during the timeout, this could cause a memory leak.

**Suggested Fix:**
```typescript
const showToast = useCallback((message: string) => {
    setToast(message);
    const timeoutId = setTimeout(() => setToast(null), 2000);
    // Consider storing and clearing the timeout on unmount
}, []);
```

---

### 3. Data Persistence & Integrity

#### ✅ [FIXED] Error Handling in sessionStorage.ts
**File:** `src/utils/sessionStorage.ts:54-67`  
**Status:** JSON parsing is now wrapped in try/catch with safe mode fallback.

```typescript
export function getSessions(): Session[] {
    try {
        const saved = localStorage.getItem(SESSIONS_KEY);
        if (!saved) return [];
        
        const parsed = JSON.parse(saved);
        return validateSessionsArray(parsed);
    } catch (error) {
        console.error('Failed to parse sessions from localStorage:', error);
        // Safe mode: return empty array instead of crashing
        return [];
    }
}
```

#### ✅ [FIXED] Schema Validation Added
**File:** `src/utils/sessionStorage.ts:17-52`  
**Status:** Added `validateSessionSchema()` and `validateSessionsArray()` functions that verify loaded JSON matches the `Session` type structure. Invalid entries are logged and skipped.

```typescript
function validateSessionSchema(data: unknown): data is Session {
    if (!data || typeof data !== 'object') return false;
    const session = data as Record<string, unknown>;
    
    if (typeof session.id !== 'string') return false;
    if (typeof session.sessionNumber !== 'number') return false;
    // ... more validation
    return true;
}
```

#### ✅ [FIXED] Safe localStorage Writes
**File:** `src/utils/sessionStorage.ts:69-80`  
**Status:** `saveSessions()` now wrapped in try-catch to handle quota exceeded errors gracefully.

```typescript
export function saveSessions(sessions: Session[]): void {
    try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
        console.error('Failed to save sessions to localStorage:', error);
    }
}
```

#### ✅ [Added] Schema Version Export
**File:** `src/utils/sessionStorage.ts:8`  
**Status:** Added exported `SCHEMA_VERSION = '1.1'` constant for future migration support.

---

### 4. Security Assessment

#### ✅ [Low] No Hardcoded Credentials
**Status:** No API keys, passwords, or secrets found in the codebase.

#### ⚠️ [Medium] Missing Input Validation for Session Number
**File:** `src/components/SessionPicker.tsx:70-71`  
**Issue:** Session number from user input is parsed but not validated for reasonable bounds.
```typescript
onChange={(e) => setSessionNumber(parseInt(e.target.value) || 1)}
```

**Suggestion:** Add bounds checking:
```typescript
onChange={(e) => {
    const num = parseInt(e.target.value) || 1;
    setSessionNumber(Math.max(1, Math.min(9999, num)));
}}
```

#### ✅ [Low] confirm() Dialog for Destructive Actions
**File:** `src/components/SessionPicker.tsx:33-38` and `src/components/views/RestView.tsx:105-106`  
**Status:** Destructive actions (delete session, long rest) require user confirmation. Good practice.

#### 🔴 [High] Capacitor Security Configuration Missing
**Issue:** The problem statement mentions Capacitor integration with Camera and GPS plugins, but the `/android` directory and `capacitor.config.ts` do not exist in the repository. This makes it impossible to review:
- Android runtime permission handling
- Secure plugin implementation
- AndroidManifest.xml permissions
- ProGuard/R8 configuration

**Action Required:** The Capacitor project must be initialized before Android deployment.

---

### 5. UI/UX & Mobile Best Practices

#### ✅ [Low] Excellent Touch Target Sizes
**File:** `src/index.css`  
**Status:** Buttons have adequate padding (44px+ tap targets per Material Design guidelines).

#### ✅ [Low] Safe Area Inset Support
**File:** `src/index.css:719-727`  
**Status:** Proper handling for notched devices:
```css
@supports (padding-bottom: env(safe-area-inset-bottom)) {
    nav { padding-bottom: env(safe-area-inset-bottom); }
    header { padding-top: env(safe-area-inset-top); }
}
```

#### ✅ [Low] Reduced Motion Support
**File:** `src/index.css:737-746`  
**Status:** Respects `prefers-reduced-motion` media query for accessibility.

#### ⚠️ [Medium] Hardcoded Portrait Image Paths
**File:** `src/components/layout/AppShell.tsx:73-79`  
**Issue:** Character portrait and background images use hardcoded paths that may not exist in public assets.
```typescript
<img
    src="/assets/aramancia-portrait.jpg"
    alt="Aramancia"
    onError={(e) => { e.currentTarget.style.display = 'none'; }}
/>
```

**Suggestion:** Provide a fallback SVG placeholder or use a default avatar component.

#### ⚠️ [Low] Font Loading Performance
**File:** `src/index.css:4`  
**Issue:** Loading 3 Google Fonts (Cinzel, Lora, Inter) with multiple weights via CSS import could delay First Contentful Paint.

**Suggestion:** Use `<link rel="preload">` in `index.html` with `font-display: swap` or bundle fonts locally for offline capability.

#### ✅ [Low] AMOLED-Friendly Dark Theme
**File:** `src/index.css:12-15`  
**Status:** Deep blacks (`#0a0a0a`, `#050505`) will leverage AMOLED power savings on Nothing Phone (2a).

---

### 6. Capacitor & Android Deployment Readiness

#### 🔴 [Critical] Missing Capacitor Project
**Issue:** The `/android` directory mentioned in requirements does not exist. The app is currently a web-only PWA.

**Required Steps for Android Deployment:**
1. Initialize Capacitor: `npx cap init "Aramancia Tracker" com.daytimeblues.aramancia`
2. Add Android platform: `npx cap add android`
3. Configure `capacitor.config.ts` with proper server URL and plugin settings
4. Add native plugins for Camera/GPS if needed
5. Configure AndroidManifest.xml with required permissions

#### ⚠️ [High] PWA Configuration Present but Not Android-Optimized
**File:** `vite.config.ts:9-68`  
**Status:** The app has a solid PWA configuration with service worker caching, but:
- No `capacitor.config.ts` exists
- The PWA manifest theme_color is white, which may conflict with dark UI
- No Android-specific icons (adaptive icons) are configured

---

### 7. Code Quality & Maintainability

#### ✅ [Low] Excellent Type Definitions
**File:** `src/types/index.ts`  
**Status:** Comprehensive, well-documented TypeScript interfaces for all domain objects.

#### ✅ [Low] Clean Component Structure
**Status:** Components are logically organized:
- `/widgets` - Reusable stat widgets
- `/views` - Tab content views
- `/layout` - App shell and navigation
- `/minions` - Minion-specific components

#### ⚠️ [Low] Inconsistent Error Boundary Usage
**File:** `src/App.tsx:382-441`  
**Issue:** `ErrorBoundary` only wraps the Settings tab, not the entire application.

**Suggestion:** Wrap the main `App` content in `ErrorBoundary` in `main.tsx`:
```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
```

#### ✅ [Low] Good Use of Constants
**File:** `src/utils/srdRules.ts:180-188`  
**Status:** Level and ability score bounds are properly defined as named constants.

---

## Positive Highlights

1. **Faithful SRD 5.1 Implementation**: The rules engine accurately calculates D&D mechanics. Edge cases like negative CON modifiers and level clamping are handled correctly.

2. **Comprehensive Test Suite**: 44 tests covering critical game logic provide confidence in correctness.

3. **Thematic UI Cohesion**: The "Gothic-Parchment" aesthetic is consistently applied with elegant monochrome accents, appropriate for a Necromancer's tool.

4. **RAW Compliance in Game Logic**: The `updateHealth` function correctly implements:
   - Temporary HP absorption before regular HP
   - Concentration save DC calculation on damage
   - Death save reset when healed from 0 HP

5. **Mobile-First CSS**: Responsive breakpoints, safe area handling, and touch-friendly targets demonstrate mobile awareness.

6. **Good State Management**: React state is lifted appropriately to `App.tsx` with props drilled to children, avoiding unnecessary complexity for an app of this size.

---

## Clarifying Questions

1. **Capacitor Status**: Was the `/android` directory removed from version control? The problem statement mentions it exists with ID `com.daytimeblues.aramancia`.

2. **Target API Level**: What are the minimum and target Android SDK versions? This affects permission handling and API compatibility.

3. **Camera/GPS Usage**: The problem statement mentions photo/video attachment and GPS location tagging, but no Capacitor plugins or related code exist. Are these features planned or already removed?

---

## Recommendations for Next Steps (Pre-Deployment)

### ✅ COMPLETED (This PR)
- ~~**Add Error Handling to localStorage Operations**~~ ✅ DONE in `sessionStorage.ts`
- ~~**Implement Schema Validation**~~ ✅ DONE with `validateSessionSchema()`
- ~~**Memoize `updateHealth`**~~ ✅ DONE with `useCallback`
- ~~**Add Debounced Writes**~~ ✅ DONE with 500ms debounce

### Priority 1 - Critical (Must Fix)
1. **Initialize Capacitor Project** (requires system setup)
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init "Aramancia Tracker" com.daytimeblues.aramancia
   npx cap add android
   ```

2. **Wrap App with Global ErrorBoundary** in `main.tsx`

### Priority 2 - High (Should Fix)
3. **Add Input Validation** for user-entered numbers (session number, ability scores)

### Priority 3 - Medium (Nice to Have)
4. **Bundle Google Fonts Locally** for offline reliability and faster load

5. **Add Fallback Avatar** for missing character portrait

6. **Consider List Virtualization** for large minion counts (20+)

### Priority 4 - Low (Polish)
7. **Clear Toast Timeout on Unmount** to prevent memory leaks

8. **Add Loading States** for localStorage operations

9. **Configure Android Adaptive Icons** for launcher

---

## Conclusion

The Aramancia Tracker demonstrates excellent web development practices with accurate game logic and a cohesive theme. 

**Agentic Execution Summary:** This PR moved from static analysis to active fixes by implementing:
- ✅ Safe JSON parsing with try/catch
- ✅ Schema validation for corrupted data detection
- ✅ Debounced localStorage writes (500ms) to prevent UI jank
- ✅ Memoized `updateHealth` with `useCallback`

The primary remaining blocker for Nothing Phone (2a) deployment is the **missing Capacitor/Android project**, which requires system-level setup (`npx cap add android`).

The application's architecture is sound, and the attention to D&D 5e rule accuracy will provide players with a reliable tool to reduce "math fatigue" during gameplay.

---

*Report generated for Aramancia Tracker v0.0.0 - Pre-Port Review*  
*Agentic Execution Phase completed January 10, 2026*
