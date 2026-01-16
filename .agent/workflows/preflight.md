---
description: Run preflight checks before merging code
---
# Preflight Protocol

Run before submitting ANY code for review.

// turbo-all

1. Run TypeScript check:
```bash
npx tsc --noEmit
```

2. Run lint:
```bash
npm run lint
```

3. Run build:
```bash
npm run build
```

4. Run E2E tests (if available):
```bash
npx playwright test
```

5. Check logs exist in modified files:
```bash
git diff --name-only | xargs grep -l "console.log\|logger\."
```

6. Only if ALL checks pass, proceed with commit and deploy.
