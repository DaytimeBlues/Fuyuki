# Aramancia Tracker - Pre-Port Code Review Report

**Date:** January 10, 2026  
**Reviewer:** Software Architect & Senior Code Reviewer  
**Target Platform:** Nothing Phone (2a) / Android  
**Application Version:** 0.0.0 (Pre-deployment)

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

### Critical Areas Needing Attention
- ⚠️ **No Capacitor/Android Project**: The repository lacks the `/android` directory mentioned in requirements
- ⚠️ **sessionStorage Error Handling**: JSON parsing lacks try-catch protection
- ⚠️ **Memory Consideration**: Large minion arrays could benefit from virtualization
- ⚠️ **Missing Data Validation**: localStorage migrations and data integrity checks incomplete

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

#### ⚠️ [Medium] Potential Unnecessary Re-renders in App.tsx
**File:** `src/App.tsx:63-111`  
**Issue:** The `updateHealth` function is not wrapped in `useCallback`, causing potential re-renders of child components.

**Suggested Fix:**
```typescript
const updateHealth = useCallback((newCurrent: number) => {
    const delta = newCurrent - data.hp.current;
    // ... rest of logic
}, [data.hp.current, data.hp.temp, data.concentration, showToast]);
```

#### ⚠️ [Medium] Large Array Mapping in CombatView
**File:** `src/components/views/CombatView.tsx` and `src/components/minions/MinionDrawer.tsx`  
**Issue:** For players managing large undead hordes (e.g., 40+ minions from high-level Animate Dead), mapping over the entire array on every render could cause performance issues on mobile.

**Suggestion:** Consider implementing windowed/virtualized lists using `react-window` or `tanstack-virtual` if minion counts exceed 20.

#### ✅ [Low] Good Use of useCallback
**File:** `src/App.tsx`  
**Positive:** Many handlers (`updateTempHP`, `updateAC`, `updateSpellSlot`, `handleSpendHitDie`, `handleLongRest`, etc.) are properly memoized with `useCallback`.

#### ⚠️ [Low] useEffect Without Cleanup for Toast Timeout
**File:** `src/App.tsx:58-61`  
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

#### 🔴 [High] Missing Error Handling in sessionStorage.ts
**File:** `src/utils/sessionStorage.ts:11-13`  
**Issue:** JSON parsing can throw `SyntaxError` if localStorage contains corrupted data.

**Current Code:**
```typescript
export function getSessions(): Session[] {
    const saved = localStorage.getItem(SESSIONS_KEY);
    return saved ? JSON.parse(saved) : [];
}
```

**Suggested Fix:**
```typescript
export function getSessions(): Session[] {
    const saved = localStorage.getItem(SESSIONS_KEY);
    if (!saved) return [];
    
    try {
        const parsed = JSON.parse(saved);
        // Optional: validate schema
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Failed to parse sessions from localStorage:', error);
        return [];
    }
}
```

#### ⚠️ [Medium] No Schema Versioning or Migration
**File:** `src/utils/sessionStorage.ts`  
**Issue:** The problem statement mentions "Schema Versioning System (v1.1)" but no version field or migration logic exists in the code. If `CharacterData` structure changes, existing localStorage data will break.

**Suggestion:** Add a schema version field and migration logic:
```typescript
const SCHEMA_VERSION = '1.1';

interface VersionedSession extends Session {
    schemaVersion: string;
}

function migrateSession(session: VersionedSession): Session {
    // Handle migrations between versions
    if (!session.schemaVersion || session.schemaVersion < '1.1') {
        // Add new fields with defaults
    }
    return session;
}
```

#### ⚠️ [Medium] Data Loss Risk on Session Update
**File:** `src/utils/sessionStorage.ts:58-71`  
**Issue:** If `JSON.stringify` fails or localStorage quota is exceeded, data could be lost silently.

**Suggestion:** Wrap in try-catch and show user notification on failure.

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

4. **Schema Version**: The problem statement mentions "Schema Versioning System (v1.1)" but no versioning exists in `sessionStorage.ts`. Is this a documentation error or missing implementation?

---

## Recommendations for Next Steps (Pre-Deployment)

### Priority 1 - Critical (Must Fix)
1. **Initialize Capacitor Project**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init "Aramancia Tracker" com.daytimeblues.aramancia
   npx cap add android
   ```

2. **Add Error Handling to localStorage Operations** in `sessionStorage.ts`

3. **Wrap App with Global ErrorBoundary** in `main.tsx`

### Priority 2 - High (Should Fix)
4. **Implement Schema Versioning** for localStorage data with migration logic

5. **Memoize `updateHealth`** function with `useCallback`

6. **Add Input Validation** for user-entered numbers (session number, ability scores)

### Priority 3 - Medium (Nice to Have)
7. **Bundle Google Fonts Locally** for offline reliability and faster load

8. **Add Fallback Avatar** for missing character portrait

9. **Consider List Virtualization** for large minion counts (20+)

### Priority 4 - Low (Polish)
10. **Clear Toast Timeout on Unmount** to prevent memory leaks

11. **Add Loading States** for localStorage operations

12. **Configure Android Adaptive Icons** for launcher

---

## Conclusion

The Aramancia Tracker demonstrates excellent web development practices with accurate game logic and a cohesive theme. The primary blocker for Nothing Phone (2a) deployment is the **missing Capacitor/Android project**. Once initialized, the existing codebase is well-positioned for successful Android deployment with minimal modifications.

The development team should prioritize:
1. Capacitor project initialization
2. Error handling hardening
3. Performance optimizations for mobile

The application's architecture is sound, and the attention to D&D 5e rule accuracy will provide players with a reliable tool to reduce "math fatigue" during gameplay.

---

*Report generated for Aramancia Tracker v0.0.0 - Pre-Port Review*
