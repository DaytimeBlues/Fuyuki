# Accessibility Improvements

## Overview
This document tracks accessibility improvements for Phase 5.2.

## Implementation Tasks

### 1. ARIA Labels & Roles

#### High Priority Items
- [ ] Buttons with `aria-label` describing their action
- [ ] Form inputs with `aria-label` or associated label elements
- [ ] Icon buttons with `aria-label` (e.g., "+" for HP increase)
- [ ] Interactive elements with `role="button"` if they're buttons
- [ ] Modals with `role="dialog"` and `aria-modal="true"`
- [ ] Drawer/overlays with `role="dialog"` and `aria-modal="false"` (modeless)
- [ ] Toast notifications with `role="status"` and `aria-live="polite"`

#### Medium Priority Items
- [ ] Spell cards with `aria-label` describing spell name and level
- [ ] Minion cards with `aria-label` including name, HP, AC
- [ ] Stat displays with `aria-label` describing the stat being shown
- [ ] Tab navigation with `role="tablist"` and `aria-selected` on active tab
- [ ] Navigation bar with `aria-label="Main navigation"`

### 2. Keyboard Navigation

#### High Priority Items
- [ ] All interactive elements focusable via Tab (`tabIndex={0}` or global order)
- [ ] Enter/Space key triggers primary action on buttons
- [ ] Escape key closes modals/drawers
- [ ] Arrow keys navigate between items in lists (minions, spells)
- [ ] Focus management: Focus trapped in modals, restored on close
- [ ] Skip to main content after navigation

#### Medium Priority Items
- [ ] Keyboard shortcuts (e.g., 'h' for HP, 'r' for rest)
- [ ] Tab/Shift+Tab for spell slot selection
- [ ] Keyboard shortcuts documented in README

### 3. Focus Indicators

#### High Priority Items
- [ ] Visible focus ring on all focusable elements (2px solid, offset 2px)
- [ ] Focus state tracked in state (optional, for complex flows)
- [ ] Focus moves to newly opened modals/drawers
- [ ] Focus trap implementation in modal/drawer components

#### Medium Priority Items
- [ ] Focus outline color matches theme (gold accent)
- [ ] Focus offset doesn't obscure content

### 4. Screen Reader Announcements

#### High Priority Items
- [ ] Live regions for dynamic content (`aria-live="polite"`)
- [ ] Toast announcements with `role="status"` and `aria-live="polite"`
- [ ] HP changes announced
- [ ] Spell cast announcements
- [ ] Death state changes announced
- [ ] Concentration changes announced

#### Medium Priority Items
- [ ] Error messages announced via `role="alert"` or `aria-live="assertive"`
- [ ] Success messages announced
- [ ] Loading states announced

### 5. Reduced Motion Preference

#### High Priority Items
- [ ] All animations respect `prefers-reduced-motion`
- [ ] CSS `@media (prefers-reduced-motion: reduce)` blocks animations
- [ ] Focus indicators respect reduced motion
- [ ] Page transitions disabled when reduced motion preferred

#### Medium Priority Items
- [ ] Glowing/pulsing effects reduced or removed in reduced motion mode
- [ ] Drawer animations simplified in reduced motion mode
- [ ] Ripple effects optional or reduced

### 6. Color Contrast

#### High Priority Items
- [ ] All text has WCAG AA contrast ratio (4.5:1)
- [ ] Focus indicators maintain contrast on all background colors
- [ ] Toast messages have sufficient contrast
- [ ] Disabled states have sufficient contrast with text

#### Medium Priority Items
- [ ] Tooltips (if added) have high contrast
- [ ] Modal backdrops don't reduce text contrast

### 7. Touch Targets

#### High Priority Items
- [ ] All buttons minimum 44x44px touch target
- [ ] List items (minions, spells) minimum 44px height
- [ ] Navigation elements minimum 48x48px
- [ ] Input fields minimum 48px height

#### Medium Priority Items
- [ ] Spacing between touch targets (avoid accidental touches)
- [ ] Edge padding for scrollable areas
- [ ] Safe area insets respected on mobile (min 16px padding from edges)

### 8. Semantic HTML

#### High Priority Items
- [ ] Proper heading hierarchy (h1, h2, h3, h4, h5, h6)
- [ ] Lists use semantic elements (ul, ol)
- [ ] Navigation uses semantic nav element
- [ ] Main content is main or section
- [ ] Forms use label and input associations

#### Medium Priority Items
- [ ] Spell lists use semantic structure
- [ ] Character stats use dl/dt/dd structure
- [ ] Tables (if any) use semantic table structure

### 9. Error Boundaries

#### High Priority Items
- [ ] ErrorBoundary with screen reader-friendly message
- [ ] Error recovery instructions clear and actionable
- [ ] Error details available (can be expanded)
- [ ] Accessibility tree remains functional after errors

#### Medium Priority Items
- [ ] Fallback component has clear instructions
- [ ] Error state announced to screen reader
- [ ] User can attempt recovery or navigate away

### 10. Language & Localization

#### High Priority Items
- [ ] All text uses simple, clear language
- [ ] Icons accompanied by text labels (unless universally understood)
- [ ] Numbers and symbols explained in context
- [ ] Color-only information supplemented with text/labels

#### Medium Priority Items
- [ ] Status indicators use text labels (not just color)
- [ ] Spell levels written as "1st", "2nd", etc.
- [ ] Dice notation explained if not using standard format

---

## Implementation Priority

### Tier 1 (Critical - Do First)
1. Focus indicators on all buttons
2. Keyboard navigation for modals (Escape to close)
3. ARIA labels on all buttons
4. Toast notifications with role="status" aria-live="polite"

### Tier 2 (High)
5. Touch target sizes (44x44px minimum)
6. Tab navigation between main views
7. Focus trap in modals
8. Reduced motion respect

### Tier 3 (Medium)
9. Screen reader announcements for state changes
10. Keyboard shortcuts documentation
11. Semantic HTML structure
12. Color contrast audit

---

## Testing Checklist

### Automated Tests
- [ ] WAVE or axe-core integration (if available)
- [ ] Keyboard navigation tests
- [ ] Screen reader tests (NVDA on Windows, TalkBack on Android)
- [ ] Color contrast tests

### Manual Tests
- [ ] Navigate entire app with keyboard only
- [ ] Use screen reader with all features
- [ ] Test on Android with TalkBack
- [ ] Test with reduced motion enabled
- [ ] Test on Nothing Phone (2a) specifically

---

## WCAG 2.1 AA Compliance Goals

- [ ] Level A: All Tier 1 items complete
- [ ] Level AA: All Tier 2 items complete
- [ ] Level AAA: All Tier 3 items complete (stretch goal)

---

## Notes

### Current Known Limitations
- Some icons may need supplementary text labels
- Touch target sizes may need adjustment for very large hands
- Screen reader testing requires physical devices or emulators

### Resources
- WAI-ARIA Authoring Practices 1.2: https://www.w3.org/WAI/tutorials/aria
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Mobile Accessibility Best Practices: https://www.w3.org/WAI/mobile/

---

## Implementation Order

1. ✅ Start with Tier 1 (critical)
2. [ ] Move to Tier 2 (high priority)
3. [ ] Complete Tier 3 (medium priority)
4. [ ] Conduct thorough testing
5. [ ] Document and ship
