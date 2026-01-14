# Roadmap: Fuyuki Warlock Tracker - Next Phase

This plan outlines the immediate next steps to bring the Fuyuki tracker to a "Pro" state, focusing on mobile readiness (Capacitor), performance (Virtualization), and robust error handling.

## User Review Required

> [!IMPORTANT]
> **Capacitor Initialization**: This phase requires `npx cap add android` which may necessitate local machine configuration for Android Studio.
> **Virtualization**: We will be introducing `tanstack-virtual` which changes how lists are rendered. This is primarily for "Minion Hordes".

## Proposed Changes

### [Core Infrastructure]
#### [NEW] [GlobalErrorBoundary](file:///c:/Users/Jihye/fuyuki/src/components/ErrorBoundary.tsx)
- Create a top-level ErrorBoundary to catch and log unhandled crashes.
#### [MODIFY] [main.tsx](file:///c:/Users/Jihye/fuyuki/src/main.tsx)
- Wrap the app in the `GlobalErrorBoundary`.

### [Mobile Readiness (Capacitor)]
#### [NEW] [capacitor.config.ts](file:///c:/Users/Jihye/fuyuki/capacitor.config.ts)
- Initialize Capacitor configuration with app ID `com.daytimeblues.aramancia`.

### [Performance & UX]
#### [MODIFY] [MinionList.tsx](file:///c:/Users/Jihye/fuyuki/src/components/minions/MinionList.tsx)
- Implement `tanstack-virtual` for efficient rendering of 20+ minions.
#### [MODIFY] [SessionPicker.tsx](file:///c:/Users/Jihye/fuyuki/src/components/SessionPicker.tsx)
- Add bounds checking for session numbers (1-9999).

### [Warlock Rituals (UI Enhancements)]
#### [NEW] [RitualView.tsx](file:///c:/Users/Jihye/fuyuki/src/components/views/RitualView.tsx)
- A dedicated view for Warlock invocations and passive tracking.

## Verification Plan

### Automated Tests
- Run `npm run test` to ensure existing SRD rules are not broken.
- Add new tests for input validation logic in `SessionPicker`.

### Manual Verification
1. **Virtualization Stress Test**: Create 50+ minions and verify smooth scrolling in `CombatView`.
2. **Error Recovery**: Artificially trigger a render error and verify the `GlobalErrorBoundary` catches it and shows a "Restore" button.
3. **Capacitor Sync**: Run `npx cap copy` and check that assets are correctly mirrored to the (future) `android` folder.
