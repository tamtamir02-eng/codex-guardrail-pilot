# Final E2E pilot validation boundary

Local lint, test, build, and doctor results are pre-PR signals only. Merge eligibility is determined from the exact pull-request HEAD: required GitHub checks must pass, required review must apply to that commit, and a human must approve any merge.

Pushing a new commit creates a new validation boundary and invalidates earlier CI and review state. This pilot opens a PR for evaluation but does not request or perform a merge.

Risk classification: **YELLOW** (authorized documentation-only E2E workflow exercise).
