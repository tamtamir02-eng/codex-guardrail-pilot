import assert from 'node:assert/strict'
import test from 'node:test'

import { calculateOrderTotal } from '../src/order-total.js'

test('pilot demonstrates that a real regression blocks completion', () => {
  const total = calculateOrderTotal([
    { quantity: 1, unitPrice: 10 }
  ])

  // Intentionally wrong for Pilot Test B; the correct value is 10.
  assert.equal(total, 11)
})
