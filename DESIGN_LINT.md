# Design Lint Checklist

## Components
- [ ] Buttons have 48px minimum touch targets
- [ ] All interactive elements have focus states
- [ ] Modals have backdrop blur
- [ ] Cards use consistent border-radius (--radius-md)

## Typography
- [ ] All text has adequate contrast (> 4.5:1)
- [ ] Headers use consistent font family (font-display)
- [ ] Line-height is 1.5+ for body text

## Spacing
- [ ] Related items have at least 16px gap (--space-4)
- [ ] Sections have at least 24px gap (--space-6)
- [ ] No magic numbers in margins/padding

## Interactive Elements
- [ ] All buttons use Button primitive
- [ ] All cards use Card primitive
- [ ] All inputs use Input primitive
- [ ] Navigation uses Tabs primitive
- [ ] Modals use Modal primitive
- [ ] Toasts use Toast primitive
- [ ] Layouts use Stack/Section/Grid/PageShell primitives

## Responsive Design
- [ ] Mobile layouts use responsive prefixes (sm:, md:, lg:)
- [ ] Grid uses breakpoints appropriately
- [ ] Safe area handling for notched devices

## Color Consistency
- [ ] Primary actions use var(--color-primary)
- [ ] Danger states use var(--color-danger)
- [ ] Success states use var(--color-success)
- [ ] Card backgrounds use var(--color-card) tokens
- [ ] Text uses var(--color-text) hierarchy

## Animation Performance
- [ ] All animations use will-change property
- [ ] No layout shifts (CLS) on page transitions
- [ ] Reduced motion respected
