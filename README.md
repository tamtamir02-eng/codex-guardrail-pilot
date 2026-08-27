# Codex Guardrail V4.2 Pilot

Minimal, dependency-free JavaScript repository used to verify the Autonomous Development Guardrail V4.2 architecture. The application code is synthetic: it has no real authentication, database, credentials, network calls, deployment target, or production data.

## Current enforcement

Changes to `main` are controlled by GitHub Ruleset `21314805` and must use a feature branch and Pull Request.

Required checks on the exact PR HEAD are:

- `validate`, produced by GitHub Actions App ID `15368`.
- `guardrail-v4.2`, produced only by Guardrail App ID `4719039`.

The legacy V4.1 `guardrail-policy` job is no longer required and is not present on `main`. The Ruleset also requires one approval, approval of the most recent push, stale-approval dismissal, conversation resolution and strict status checks. Updates and non-fast-forward pushes to `main` are restricted. Only the human repository administrator has pull-request-only merge authority; the Implementer and Guardrail Apps have no bypass.

## Identity separation

- Tamir (`tamtamir02-eng`) is the authorized human reviewer and merge authority.
- Codex writes feature branches and opens PRs through the separate `tamir-codex-implementer-v4-2-pilot[bot]` identity using a process-scoped installation token.
- The Guardrail App evaluates repository metadata and creates `guardrail-v4.2`; it cannot edit repository contents or approve/merge.
- A same-name check from GitHub Actions or another App cannot satisfy the Guardrail requirement because the Ruleset binds the required check to App ID `4719039`.

## Local validation

```powershell
npm run lint
npm test
npm run build
npm run doctor
```

- `lint` checks JavaScript style using Node only.
- `test` uses the native `node:test` runner.
- `build` performs syntax and package-contract validation; no artifact is published.
- `doctor` verifies the repository-local V4 contract and the absence of custom hooks, agents and attestations.

## Risk and workflow

- `RISK_POLICY.md` describes GREEN, YELLOW and RED changes for repository contributors.
- The authoritative machine-readable GREEN/YELLOW/RED/CONTROL_PLANE policy is external to this repository in the pinned Guardrail Control Plane.
- `.codex/rules/high-blast-radius.rules` supplements the native Codex sandbox and approvals for destructive commands; it is not a merge gate.
- New commits change the HEAD SHA, rerun required checks and invalidate stale human approval.
- PR-authored files, comments, labels, checkboxes or attestations are not completion evidence.

The final architecture and Pilot evidence are maintained in [`tamtamir02-eng/guardrail-control-plane`](https://github.com/tamtamir02-eng/guardrail-control-plane). This repository remains a test target and is not a production rollout target.
