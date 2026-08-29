import assert from 'node:assert/strict'
import test from 'node:test'

import { calculateOrderTotal } from '../src/order-total.js'

test('pilot regression is repaired before completion', () => {
  const total = calculateOrderTotal([
    { quantity: 1, unitPrice: 10 }
  ])

  assert.equal(total, 10)
})
