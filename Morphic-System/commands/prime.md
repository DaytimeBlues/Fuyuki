# /prime-agent

## Description
Initializes the session by loading the agent identity, user context, and specific project details.

## Usage
`/prime-agent [project-name]`
Example: `/prime-agent aramancia`

## Workflow
1.  **Read Identity:** Read `AGENT.md` to establish tone and rules.
2.  **Read System Context:** Read `context/system/user-preferences.md` (if exists).
3.  **Load Project:**
    -   If project is "aramancia", read `context/projects/aramancia.md`.
4.  **Check Status:** Read the last 5 entries of `logs/work-log.md` to establish continuity.
5.  **Report:** Output a 1-sentence summary of where we left off and ask for the immediate next action.

---
