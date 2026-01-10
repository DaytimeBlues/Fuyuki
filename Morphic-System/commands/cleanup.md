# /cleanup

## Description
Summarizes the session, updates logs, and checks for abstractable patterns.

## Workflow
1.  **Update Log:** Append a summary of today's work to `logs/work-log.md`. Format: `[YYYY-MM-DD] [Project] - Summary`.
2.  **Update Context:** If we changed architectural decisions, update the relevant `context/projects/[project].md` file.
3.  **Check for Abstraction:**
    -   Did we solve a recurring problem?
    -   If yes, suggest a new command (e.g., "I noticed we run these 3 grep commands often. Shall I create a `/search-code` command?").
4.  **Next Steps:** List the single most important task for the next session.

---
