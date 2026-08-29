# Codex Implementer wrapper pilot

The local pilot wrapper keeps GitHub authentication separate from the human account. It creates a short-lived GitHub App installation token in its parent process and passes only that token to a child Codex session.

The wrapper is pinned to this repository and permits a write-enabled session only on a `codex/**` feature branch. Its process-scoped Git configuration disables interactive credentials and persistent credential helpers, so an invalid or expired App token fails closed instead of falling back to a human identity.

The wrapper does not change `gh auth`, Git Credential Manager, global Git configuration, repository remotes, Rulesets, or the protected `main` branch. Merge readiness still depends on the exact PR HEAD passing GitHub checks and receiving human approval.

Risk classification: **YELLOW** (developer workflow and GitHub identity documentation).
