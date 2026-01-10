# /build-feature

## Description
Standard workflow for implementing a new feature with proper planning and testing.

## Usage
```
/build-feature "[feature name]"
```
Example: `/build-feature "Add hit dice tracking"`

## Workflow

### Phase 1: Analysis
1. Check existing code patterns in relevant files
2. Identify affected components
3. Check for D&D 5e RAW compliance (if applicable)
4. List dependencies and potential conflicts

### Phase 2: Plan
Output a brief implementation plan:
```
Feature: [NAME]
Files to modify: [LIST]
New files: [LIST or "None"]
D&D Rules: [RELEVANT RULES or "N/A"]
Estimated steps: [NUMBER]
```

### Phase 3: Implement
1. Create/modify files in order of dependency
2. Follow existing patterns (functional components, hooks, Tailwind)
3. Maintain type safety (TypeScript)
4. Test incrementally

### Phase 4: Verify
1. Run `npm run lint` - fix any errors
2. Run `npm run build` - ensure no TypeScript errors
3. Manual test the feature
4. Check edge cases

### Phase 5: Document
1. Update relevant context files if architecture changed
2. Note in work-log

## Quality Checklist
- [ ] Follows existing code patterns
- [ ] TypeScript types defined
- [ ] No lint errors
- [ ] D&D RAW compliant (if applicable)
- [ ] Edge cases handled
- [ ] UI matches existing aesthetic
