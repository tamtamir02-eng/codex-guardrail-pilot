import assert from 'node:assert/strict'
import test from 'node:test'

import { canAccess } from '../auth/access-policy.js'

test('viewer can only read', () => {
  assert.equal(canAccess('viewer', 'read'), true)
  assert.equal(canAccess('viewer', 'write'), false)
})

test('admin can manage while unknown roles are denied', () => {
  assert.equal(canAccess('admin', 'manage'), true)
  assert.equal(canAccess('unknown', 'read'), false)
})

test('synthetic pilot reviewer can inspect but cannot modify', () => {
  assert.equal(canAccess('pilot-reviewer', 'inspect'), true)
  assert.equal(canAccess('pilot-reviewer', 'write'), false)
  assert.equal(canAccess('pilot-reviewer', 'manage'), false)
})
