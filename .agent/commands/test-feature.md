# /test-feature

## Description
Standard workflow for testing D&D 5e mechanics against RAW (Rules as Written).

## Usage
```
/test-feature "[feature name]"
```
Example: `/test-feature "AC calculation"`

## Workflow

### Phase 1: Identify Test Cases
1. Check SRD 5.1 rules for the mechanic
2. List expected behaviors
3. Identify edge cases (multiclassing, stacking, extremes)
4. Check existing workflows in `.agent/workflows/`

### Phase 2: Setup Test Environment
1. Start dev server: `npm run dev`
2. Open browser to localhost:5173
3. Reset character to known state if needed

### Phase 3: Execute Tests

#### Test Categories
| Category | Focus |
|----------|-------|
| Rules Lawyer | Mathematical precision, rule interactions |
| Min-Maxer | Extreme values, stat caps, bonus stacking |
| Chaos Gremlin | Invalid inputs, negative values, UI breaking |
| Newbie | UX clarity, tooltips, error messages |

### Phase 4: Document Results
```
Feature: [NAME]
Tests Run: [NUMBER]
Passed: [NUMBER]
Failed: [NUMBER]

Bugs Found:
- [BUG 1]: [Description] - [Severity]
- [BUG 2]: [Description] - [Severity]
```

### Phase 5: Report
If bugs found:
1. Create detailed reproduction steps
2. Reference specific SRD 5.1 rule violated
3. Suggest fix approach

## Related Workflows
- `.agent/workflows/test-ac-logic.md`
- `.agent/workflows/test-hp-logic.md`
- `.agent/workflows/test-combat.md`
