# /abstract

## Description
Creates a reusable command from a recurring pattern or solved problem.

## Usage
```
/abstract [command-name] "[description]"
```
Example: `/abstract debug-ac "Debug AC calculation issues"`

## Workflow

### Step 1: Analyze Pattern
Review the current session or recent logs to identify:
- Repeated steps
- Common debugging flows
- Established workflows

### Step 2: Define Command
Create a new file in `.agent/commands/[command-name].md` with:
- Clear description
- Step-by-step workflow
- Expected inputs/outputs
- Edge cases to consider

### Step 3: Document
Add entry to work-log noting the new command.

### Step 4: Confirm
```
✓ Created: /[command-name]
Purpose: [DESCRIPTION]
Location: .agent/commands/[command-name].md
```

## Template for New Commands
```markdown
# /[command-name]

## Description
[What this command does]

## Usage
\`\`\`
/[command-name] [arguments]
\`\`\`

## Workflow
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Notes
[Edge cases, prerequisites, related commands]
```
