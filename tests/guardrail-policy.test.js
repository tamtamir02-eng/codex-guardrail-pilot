import assert from 'node:assert/strict'
import test from 'node:test'

import { classifyChangedFiles, extractRedPatterns } from '../scripts/guardrail-policy.mjs'

const policy = `
<!-- guardrail-policy:red-paths:start -->
- \`auth/**\`
- \`security/**\`
- \`database/**\`
<!-- guardrail-policy:red-paths:end -->
`

test('GREEN and YELLOW paths do not trip the RED gate', () => {
  assert.deepEqual(
    classifyChangedFiles(['README.md', 'src/order-total.js', 'tests/order-total.test.js'], policy),
    { classification: 'GREEN/YELLOW', redMatches: [] }
  )
})

test('RED paths fail closed regardless of PR-authored claims', () => {
  assert.deepEqual(
    classifyChangedFiles(['auth/session.js'], policy),
    {
      classification: 'RED',
      redMatches: [{ path: 'auth/session.js', pattern: 'auth/**' }]
    }
  )
})

test('RED matching is case-insensitive and portable across path separators', () => {
  assert.equal(classifyChangedFiles(['Security\\Policy.js'], policy).classification, 'RED')
})

test('a missing machine-readable policy block fails closed', () => {
  assert.throws(() => extractRedPatterns('# no configured paths'), /missing/)
})
