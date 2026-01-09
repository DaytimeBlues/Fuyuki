# /cleanup

## Description
Summarizes the session, updates logs, and checks for abstractable patterns.

## Usage
```
/cleanup
```

## Workflow

### Step 1: Update Log
Append a summary of today's work to `.agent/logs/work-log.md`.

Format:
```
## [YYYY-MM-DD] [Project]
- Summary of work completed
- Key decisions made
- Issues encountered (if any)
```

### Step 2: Update Context
If we changed architectural decisions or important patterns, update the relevant `.agent/context/projects/[project].md` file.

### Step 3: Check for Abstraction
Ask yourself:
- Did we solve a recurring problem?
- Did we run the same commands multiple times?
- Did we establish a new pattern worth documenting?

If yes, suggest a new command:
> "I noticed we [PATTERN]. Shall I create a `/[command-name]` command?"

### Step 4: Next Steps
List the single most important task for the next session:
```
→ Next: [TASK DESCRIPTION]
```

## Output Format
```
✓ Session logged
✓ Context updated (if applicable)

Abstraction opportunity: [SUGGESTION or "None identified"]

→ Next: [MOST IMPORTANT TASK]
```
