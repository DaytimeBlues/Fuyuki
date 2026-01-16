# /prime-agent

## Description
Initializes the session by loading the agent identity, user context, and specific project details.

## Usage
```
/prime-agent [project-name]
```
Example: `/prime-agent aramancia`

## Workflow

### Step 1: Read Identity
Read `.agent/AGENT.md` to establish tone, rules, and project-specific directives.

### Step 2: Read System Context
Read `.agent/context/system/user-preferences.md` (if exists) for global constraints.

### Step 3: Load Project Context
- If project is "aramancia", read `.agent/context/projects/aramancia.md`
- If project is "math-omni", read `.agent/context/projects/math-omni.md`
- If project is "dictaphone", read `.agent/context/projects/dictaphone.md`

### Step 4: Check Status
Read the last 5 entries of `.agent/logs/work-log.md` to establish continuity.

### Step 5: Report
Output a 1-sentence summary of where we left off and ask for the immediate next action.

## Output Format
```
✓ Primed for [PROJECT]
Last session: [SUMMARY]
Ready for: [NEXT TASK or "your instructions"]
```
