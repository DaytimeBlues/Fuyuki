# Performance Quick Reference

Quick reference for maintaining smooth performance in the Aramancia Tracker.

## CSS Animation Rules

### ✅ DO
```css
/* GPU-accelerated animations */
.my-element {
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
  from { transform: translate3d(0, 20px, 0); opacity: 0; }
  to { transform: translate3d(0, 0, 0); opacity: 1; }
}
```

### ❌ DON'T
```css
/* CPU-intensive, will cause jank */
.my-element {
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from { top: 20px; opacity: 0; } /* Animating 'top' triggers layout! */
  to { top: 0; opacity: 1; }
}
```

## Only Animate These Properties

Safe for 60 FPS:
- ✅ `transform` (translate3d, scale, rotate)
- ✅ `opacity`
- ✅ `filter` (blur, brightness, etc.)

Causes jank:
- ❌ `width`, `height`
- ❌ `top`, `left`, `right`, `bottom`
- ❌ `margin`, `padding`
- ❌ `background-color` (use opacity on overlay instead)

## React Performance Rules

### Component Memoization

```typescript
// ✅ DO: Memo for expensive components
export const ExpensiveWidget = memo(function ExpensiveWidget({ data }) {
  // Complex rendering logic
  return <div>...</div>;
});

// ❌ DON'T: Export without memo
export function ExpensiveWidget({ data }) {
  // Will re-render on every parent update!
  return <div>...</div>;
}
```

### Callback Stability

```typescript
// ✅ DO: Stable callbacks
const handleClick = useCallback(() => {
  doSomething();
}, [/* dependencies */]);

// ❌ DON'T: Inline functions
<button onClick={() => doSomething()}>
  {/* New function every render! */}
</button>
```

### Computation Memoization

```typescript
// ✅ DO: Memo expensive calculations
const expensiveValue = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0);
}, [data]);

// ❌ DON'T: Calculate every render
const expensiveValue = data.reduce((acc, item) => acc + item.value, 0);
```

## Touch Optimization Checklist

- [ ] All buttons are at least 48x48px
- [ ] `touch-action: manipulation` on interactive elements
- [ ] No hover effects on mobile (use `@media (hover: hover)`)
- [ ] Tap highlight removed (`-webkit-tap-highlight-color: transparent`)
- [ ] Scroll performance optimized (`-webkit-overflow-scrolling: touch`)

## Animation Performance Checklist

- [ ] Using `translate3d()` instead of `translate()`
- [ ] Using cubic-bezier easing instead of linear/ease
- [ ] Animation duration < 400ms (feels snappier)
- [ ] `will-change` property set on animated elements
- [ ] Only animating transform/opacity
- [ ] No layout-triggering animations

## Bundle Size Guidelines

Keep bundles small:
- Single component: < 10 KB
- Full app (gzipped): < 150 KB
- Images: Use WebP, < 100 KB each
- Fonts: Subset to needed characters only

## Testing Commands

```bash
# Build for production
npm run build

# Check bundle size
npm run build && ls -lh dist/assets/

# Run lint
npm run lint

# Dev server
npm run dev

# Preview production build
npm run preview
```

## Performance Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Performance tab → Record
3. Interact with app
4. Check: 60 FPS, no long tasks

### React DevTools
1. Install React DevTools
2. Profiler tab → Record
3. Change state
4. Check: No unnecessary re-renders

### Lighthouse
1. DevTools → Lighthouse
2. Run audit
3. Target: 90+ Performance

## Common Issues & Fixes

### Issue: Choppy animations
**Fix:** Use `translate3d()` instead of `translate()`

### Issue: Slow button response
**Fix:** Add `touch-action: manipulation`

### Issue: Component re-renders too much
**Fix:** Wrap with `React.memo()`

### Issue: Callback causes re-renders
**Fix:** Wrap with `useCallback()`

### Issue: Calculation runs every render
**Fix:** Wrap with `useMemo()`

### Issue: Large bundle size
**Fix:** Code split, lazy load, remove unused imports

## Performance Budget

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Performance: > 90
- Bundle size (gzipped): < 150 KB
- Animation FPS: 60

## More Information

- Full guide: [PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md)
- Android setup: [ANDROID_STUDIO_SETUP.md](./ANDROID_STUDIO_SETUP.md)
- Project README: [README.md](./README.md)
