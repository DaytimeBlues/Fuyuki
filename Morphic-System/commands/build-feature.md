# /build-feature

## Description
Standard step-by-step to implement a small feature or fix safely.

## Workflow
1. Prime the agent: `/prime-agent aramancia`.
2. Create a focused branch: `feature/<short-desc>`.
3. Implement changes in small commits (max 5 files per PR ideally).
4. Run `npm run dev` and unit tests (if any).
5. Create PR and include a short description in `logs/work-log.md`.
6. On merge, run `/cleanup`.

---
