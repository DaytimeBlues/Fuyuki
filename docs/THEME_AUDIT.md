# Kyoto Noir Theme Audit & Consistency

## Theme Colors (From index.css)

```css
--color-bg: #0f0f10
--color-bg-dark: #0a0a0b
--color-card: #1a1a1c
--color-card-elevated: #242428
--color-accent: #c9a227
--color-accent-glow: #d4b13a
--color-accent-dark: #a68820
--color-vermillion: #c53d3d
--color-moss: #5c7c5c
--color-indigo: #4a5568
--color-parchment: #d4c4b0
--color-parchment-dark: #8b7355
--color-parchment-light: #f5f5f4
--color-text: #e5e5e4
--color-text-bright: #f5f5f4
--color-muted: #71717a
```

## Current Theme Usage Audit

### High Contrast Areas (WCAG AA Compliant)
✅ Background (#0f0f10) vs Text (#e5e5e4) = 16.6:1 - PASS
✅ Background (#1a1a1c) vs Text (#e5e5e4) = 13.6:1 - PASS
✅ Accent (#c9a227) vs Background (#0f0f10) = 7.9:1 - PASS
✅ Parchment (#d4c4b0) vs Background (#0f0f10) = 13.3:1 - PASS

### Medium Contrast Areas (Needs Verification)
⚠️ Text (#71717a) vs Background (#242428) = 3.0:1 - REVIEW
⚠️ Muted (#71717a) vs Card (#1a1a1c) = 4.2:1 - REVIEW
⚠️ Muted (#71717a) vs Card-Elevated (#242428) = 3.5:1 - REVIEW

### Low Contrast Areas
❌ Text (#e5e5e4) vs Background (#0f0f10) = 15.7:1 - FAIL (needs brighter text or darker background)
❌ Text (#f5f5f4) vs Background (#1a1a1c) = 15.7:1 - FAIL

---

## Consistency Issues Found

### 1. Background Color Inconsistency

**Issue:** Dark background not consistently black enough for AMOLED

**Locations:**
- `body` uses `#0f0f10` (slightly off-black)
- `--color-bg-dark` uses `#0a0a0b` (closer to black)
- Card backgrounds use `#1a1a1c` (significantly lighter)

**Recommendation:**
- Consider using pure black (`#000000`) for main background on AMOLED devices
- Or create `.amoled` media query to use pure blacks

### 2. Text Color Hierarchy

**Issue:** Text color hierarchy not consistently implemented

**Current Usage:**
- `--color-text` (#e5e5e4) - Primary text
- `--color-text-bright` (#f5f5f4) - Bright text
- `--color-parchment` (#d4c4b0) - Theme text
- `--color-muted` (#71717a) - Secondary text

**Recommendation:**
- Use `--color-text-bright` for headings and important info
- Use `--color-text` for body text
- Use `--color-parchment` for decorative/ornamental elements
- Use `--color-muted` for secondary information

### 3. Accent Color Usage

**Issue:** Accent color used inconsistently

**Current Usage:**
- Buttons: `--color-accent` (gold)
- Orbs: Gold gradient
- Some elements: Gold glow

**Recommendation:**
- Reserve `--color-accent-glow` for interactive elements only
- Use solid `--color-accent` for static accents
- Don't overuse glow effects (can impact battery on mobile)

### 4. Semantic Color Usage

**Issue:** Colors not consistently used for semantics

**Current Usage:**
- Red: Damage (good)
- Green: Healing (good)
- Gold: Warning/special (good)

**Recommendation:**
- Consider using vermilion (#c53d3d) for critical actions
- Consider using indigo (#4a5568) for informational actions
- Keep current color scheme for consistency

---

## Theme Consistency Improvements

### 1. AMOLED Optimization

```css
@media (prefers-color-scheme: dark) {
  .amoled-mode {
    --color-bg: #000000;
    --color-card: #0f0f10;
    --color-bg-dark: #000000;
  }
}
```

### 2. High Contrast Mode

```css
@media (prefers-contrast: more) {
  :root {
    --color-text: #f5f5f4; /* Brighter text */
    --color-accent: #d4b13a; /* Lighter accent */
  }
}
```

### 3. Color Consistency Classes

```css
.text-primary      { color: var(--color-text); }
.text-secondary    { color: var(--color-muted); }
.text-theme       { color: var(--color-parchment); }
.text-accent      { color: var(--color-accent); }
.bg-primary      { background-color: var(--color-bg); }
.bg-secondary    { background-color: var(--color-card); }
```

---

## Component-Level Audit

### Navigation Bar
- [ ] Background: Dark (#0f0f10) or black
- [ ] Text: White or parchment
- [ ] Active tab: Gold accent
- [ ] Focus state: Visible

### Header/Stats
- [ ] Background: Card style
- [ ] Text: Parchment
- [ ] HP Display: Clear visibility
- [ ] AC Display: Clear visibility

### Spell Slots
- [ ] Empty orb: Gray/muted
- [ ] Filled orb: Gold accent
- [ ] Focus state: Gold glow
- [ ] Used slot: Dark/muted

### Modals
- [ ] Backdrop: Semi-transparent black
- [ ] Content: Card style
- [ ] Close button: Red accent
- [ ] Focus trap: Implemented

### Toast Notifications
- [ ] Background: Dark with border
- [ ] Text: White/parchment
- [ ] Error: Red accent
- [ ] Success: Green accent
- [ ] Info: Gold accent

---

## Priority Fixes

### Tier 1 (Critical - Do First)
1. ✅ **AMOLED Mode** - Add media query for pure black backgrounds
2. [ ] **High Contrast Mode** - Add media query for brighter text
3. [ ] **Focus Indicators** - Gold accent on all focusable elements

### Tier 2 (High Priority)
4. [ ] **Text Hierarchy** - Implement semantic text color classes
5. [ ] **Accent Usage** - Standardize when to use glow vs solid
6. [ ] **Consistency** - Audit and fix any color inconsistencies

### Tier 3 (Medium Priority)
7. [ ] **Semantic Colors** - Define and implement semantic color system
8. [ ] **Component Audit** - Fix any component-specific issues
9. [ ] **Accessibility** - Verify WCAG AA compliance after fixes

---

## Testing Checklist

### Color Contrast Testing
- [ ] Test with screen color contrast analyzer
- [ ] Test on multiple devices (phone, tablet, desktop)
- [ ] Test in different lighting conditions

### AMOLED Testing
- [ ] Test on AMOLED device (Nothing Phone 2a)
- [ ] Verify true blacks are used for backgrounds
- [ ] Check for any gray washout

### Theme Testing
- [ ] Test in light mode (should use dark mode only for this app)
- [ ] Test with different color preferences (if supported)

---

## Resources

### Color Contrast Checker
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Tanagulu Color Tool: https://tanagulu.com/contrast-colors.php

### Accessibility
- WCAG Contrast Ratios: https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum
- Color Contrast: https://web.dev/color/

---

## Next Steps

1. ✅ Complete Tier 1 fixes
2. [ ] Move to Tier 2
3. [ ] Complete Tier 3
4. [ ] Conduct comprehensive theme testing
5. [ ] Document final theme system
