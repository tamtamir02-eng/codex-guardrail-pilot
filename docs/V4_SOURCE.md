# Embedded V4 source

Source of truth: `../autonomous-development-guardrail-v4`, version `4.0.0`, at pilot setup time.

Embedded and pilot-adapted components:

- `AGENTS.md`
- `RISK_POLICY.md`
- `.codex/rules/high-blast-radius.rules`
- `.github/workflows/guardrail-v4-ci.yml`
- `.github/CODEOWNERS.example`
- `.github/pull_request_template.md`

The general Python validation helper was intentionally not copied. This dependency-free Node pilot already declares unambiguous `lint`, `test`, `build`, and `doctor` scripts; running them directly removes an unnecessary connector. The pilot doctor is limited to this repository contract and is not a security boundary, reviewer, attestation, or evidence store.

No V3/V3.1 component was copied.
