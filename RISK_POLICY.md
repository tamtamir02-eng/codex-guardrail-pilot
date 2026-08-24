# V4 Risk Policy

סיווג הסיכון מתאר את ה־blast radius של השינוי, לא את מספר השורות. כאשר יש ספק, בוחרים ברמה הגבוהה יותר ומתעדים את הסיבה ב־PR.

| רמה | דוגמאות | validation ו־review נדרשים |
|---|---|---|
| GREEN | תיעוד, typo, comments, test data ללא behavior | suite קיים ורלוונטי או הצהרה מפורשת שאין suite; PR; required CI; human merge |
| YELLOW | behavior רגיל, bug fix, dependency לא רגישה, API פנימי, refactor | lint/typecheck/tests/build הקיימים לפי ה־repository; PR HEAD CI; Codex PR review; human approval |
| RED | auth/authz/permissions, secrets/crypto, payments, production data/schema, infrastructure/IAM, deploy/release, destructive migration, public security boundary | כל דרישות YELLOW; בדיקות ממוקדות של הגבול; CODEOWNER/מומחה אנושי; Codex Security או fallback אנושי מתועד; אין production action ללא אישור נפרד |

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
| Codex native PR review | לפי policy של repo | כן | כן |
| Human approval | כן, לפני merge | כן | CODEOWNER/מומחה |
| Codex Security | לא | לפי שיקול | כן כשזמין |
| Security fallback אנושי | לא | לפי שיקול | חובה אם Security לא זמין/לא הושלם |

Label, checkbox, comment או קובץ שנוצרו על ידי ה־PR אינם proof. GitHub status checks, review records וה־commit SHA הם מקורות המצב. push חדש יוצר SHA חדש וחייב להפעיל מחדש CI ולבטל review ישן בהתאם ל־ruleset.
