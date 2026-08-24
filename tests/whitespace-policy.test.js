import assert from 'node:assert/strict'
import test from 'node:test'

import { inspectWhitespace } from '../scripts/whitespace-policy.mjs'

test('accepts LF line endings', () => {
  assert.deepEqual(inspectWhitespace('const value = 1\n', 'lf.js'), [])
})

test('accepts CRLF line endings without treating carriage returns as whitespace', () => {
  assert.deepEqual(inspectWhitespace('const value = 1\r\n', 'crlf.js'), [])
})

test('rejects actual trailing spaces', () => {
  assert.deepEqual(
    inspectWhitespace('const value = 1  \r\n', 'trailing.js'),
    ['trailing.js:1: trailing whitespace']
  )
})
