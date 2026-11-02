---
name: "source-command-review-pr"
description: "Migrated source command `review-pr`"
---

# source-command-review-pr

Use this skill when the user asks to run the migrated source command `review-pr`.

## Command Template

Review my current git changes as if you were a strict code reviewer.

Run `git diff main...HEAD` (committed), `git diff --cached` (staged) and `git diff` (unstaged), and check for:

- Bugs or logic errors
- Security vulnerabilities
- TypeScript type safety issues
- Missing error handling
- Performance problems
- Anything that would fail a code review

Be specific about file names and line numbers.
