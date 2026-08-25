import assert from 'node:assert/strict'
import test from 'node:test'

import { canAccess } from '../src/access-policy.js'

test('viewer can only read', () => {
  assert.equal(canAccess('viewer', 'read'), true)
  assert.equal(canAccess('viewer', 'write'), false)
})

test('admin can manage while unknown roles are denied', () => {
  assert.equal(canAccess('admin', 'manage'), true)
  assert.equal(canAccess('unknown', 'read'), false)
})
