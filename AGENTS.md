# Autonomous Development Guardrail V4 Pilot

This repository uses GitHub and native Codex controls as its completion boundary.

- Work on a feature branch. Do not push directly to the protected default branch.
- Reuse the declared `npm run lint`, `npm test`, `npm run build`, and `npm run doctor` commands.
- Never run repository code outside the Codex sandbox or an isolated CI runner.
- Classify the change using `RISK_POLICY.md`; record GREEN, YELLOW, or RED in the PR.
- Treat changes under `auth/` as RED for this pilot.
- Do not claim completion from local results alone. The exact PR HEAD commit must pass required GitHub checks.
- Do not create evidence files, attestations, fingerprints, receipts, or substitute reviews.
- New commits invalidate earlier CI and review state. Wait for checks and applicable review evidence on the new HEAD.
- RED changes require the configured security path and human approval before merge.
- Destructive or external commands require native sandbox/approval handling and the project Rules.
- Only a human may approve merge or production actions.

## Code Review Rules

- Review the PR diff without modifying the branch.
- Report correctness, regression, security, permissions, data-loss, and missing-test risks.
- Verify the risk class and that validation matches the changed surface.
- For RED changes, require security review and the designated CODEOWNER/human reviewer.
- Do not accept a PR-authored file or comment as proof that review or CI occurred.
- Treat Codex PR Review as advisory independent review, not the sole hard gate.
- Accept review evidence only from a completed GitHub review record on the current HEAD with no open blocking findings.
- Eyes reactions, standalone comments, old-SHA reviews, and incomplete review requests are not evidence.
- If Codex Review has no valid record within 15 minutes, state `HUMAN REVIEW REQUIRED` and do not claim `READY`.
