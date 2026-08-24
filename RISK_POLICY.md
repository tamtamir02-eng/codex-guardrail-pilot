# V4 Risk Policy

סיווג הסיכון מתאר את ה־blast radius של השינוי, לא את מספר השורות. כאשר יש ספק, בוחרים ברמה הגבוהה יותר ומתעדים את הסיבה ב־PR.

| רמה | דוגמאות | validation ו־review נדרשים |
|---|---|---|
| GREEN | תיעוד, typo, comments, test data ללא behavior | suite קיים ורלוונטי או הצהרה מפורשת שאין suite; PR; required CI; human merge |
| YELLOW | behavior רגיל, bug fix, dependency לא רגישה, API פנימי, refactor | lint/typecheck/tests/build הקיימים לפי ה־repository; PR HEAD CI; Codex PR review; human approval |
| RED | auth/authz/permissions, secrets/crypto, payments, production data/schema, infrastructure/IAM, deploy/release, destructive migration, public security boundary | כל דרישות YELLOW; בדיקות ממוקדות של הגבול; CODEOWNER/מומחה אנושי; Codex Security או fallback אנושי מתועד; אין production action ללא אישור נפרד |

## Machine-readable RED paths

`guardrail-policy` reads only this bounded block. A match is failure-closed during the pilot; PR text, labels, checkboxes, and self-authored claims cannot override it.

<!-- guardrail-policy:red-paths:start -->
- `auth/**`
- `security/**`
- `payments/**`
- `billing/**`
- `database/**`
- `migrations/**`
- `infrastructure/**`
- `infra/**`
- `iam/**`
- `secrets/**`
- `crypto/**`
- `production/**`
- `deploy/**`
- `release/**`
- `terraform/**`
- `kubernetes/**`
<!-- guardrail-policy:red-paths:end -->

## Pilot-specific classification

- שינוי ב־`src/` הוא בדרך כלל YELLOW.
- שינוי ב־`auth/` הוא RED, אף שזהו קוד סימולציה ללא מערכת authentication אמיתית.
- שינוי documentation קוסמטי בלבד הוא GREEN.
- שינוי ב־`.github/`, `.codex/rules/`, `AGENTS.md`, policy, tests או doctor הוא לפחות YELLOW; החלשת gate היא RED.

## Gates שאינם ניתנים להחלפה בהצהרה

| Gate | GREEN | YELLOW | RED |
|---|---:|---:|---:|
| Feature branch + PR | כן | כן | כן |
| CI required על HEAD SHA | כן | כן | כן |
| Codex native PR review | advisory | advisory | advisory; security/human gate remains mandatory |
| Human approval | כן, לפני merge | כן | CODEOWNER/מומחה |
| Codex Security | לא | לפי שיקול | כן כשזמין |
| Security fallback אנושי | לא | לפי שיקול | חובה אם Security לא זמין/לא הושלם |

Label, checkbox, comment או קובץ שנוצרו על ידי ה־PR אינם proof. GitHub status checks, review records וה־commit SHA הם מקורות המצב. push חדש יוצר SHA חדש וחייב להפעיל מחדש CI ולבטל review ישן בהתאם ל־ruleset.

## Codex PR Review evidence

Codex PR Review is an advisory independent review, not the only hard gate. It can improve the human decision, but it cannot replace required CI, the RED policy gate, or human merge approval.

Review evidence is valid only when GitHub contains a completed review record tied to the current PR HEAD SHA and no blocking finding from that review remains open. A new commit invalidates evidence associated with an older SHA.

None of the following is review evidence: an eyes reaction, a standalone comment, a review on an older SHA, or a review request without a completed review record. A PR description or branch-authored file is never review evidence.

Allow up to 15 minutes after requesting Codex Review on the current HEAD. If no valid review record appears, record `HUMAN REVIEW REQUIRED`; do not claim `READY`. No automated poller is required.
