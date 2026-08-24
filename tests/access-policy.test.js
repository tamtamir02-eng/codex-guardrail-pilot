import assert from 'node:assert/strict'
import test from 'node:test'

import { canAccess } from '../auth/access-policy.js'

test('viewer can only read', () => {
  assert.equal(canAccess('viewer', 'read'), true)
  assert.equal(canAccess('viewer', 'write'), false)
})

test('auditor remains read-only', () => {
  assert.equal(canAccess('auditor', 'read'), true)
  assert.equal(canAccess('auditor', 'write'), false)
  assert.equal(canAccess('auditor', 'manage'), false)
})

test('admin can manage while unknown roles are denied', () => {
  assert.equal(canAccess('admin', 'manage'), true)
  assert.equal(canAccess('unknown', 'read'), false)
})
