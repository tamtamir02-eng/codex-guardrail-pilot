# Codex Guardrail Pilot

Minimal, dependency-free JavaScript repository for the Autonomous Development Guardrail V4 GitHub pilot.

The application calculates order totals and contains an isolated `auth/` policy simulation. It has no real authentication, database, credentials, network calls, deployment target, or production data.

## Local validation

```powershell
npm run lint
npm test
npm run build
npm run doctor
```

- `lint` checks repository JavaScript style using Node only.
- `test` uses the native `node:test` runner.
- `build` performs syntax and package-contract validation; no artifact is published.
- `doctor` verifies the embedded V4 repository contract and forbidden-component absence.

## V4 controls embedded

- Short `AGENTS.md` workflow policy.
- GREEN/YELLOW/RED risk policy.
- Project-local Codex Rules for high-blast-radius commands.
- PR workflow bound to the current pull-request HEAD SHA.
- Optional CODEOWNERS example and pull-request template.
- No lifecycle hooks, custom agents, fingerprints, receipts, attestations, reviewers, or installer.

The repository is only the setup environment. Pilot Tests A–G have not started. Branch protection, rulesets, required checks, CODEOWNERS enforcement, automatic Codex review, and Codex Security are not enabled unless a later documented phase explicitly confirms them.
