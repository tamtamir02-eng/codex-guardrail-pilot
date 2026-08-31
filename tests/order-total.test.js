import assert from 'node:assert/strict'
import test from 'node:test'

import { calculateOrderTotal } from '../src/order-total.js'

test('calculates a total with tax', () => {
  const total = calculateOrderTotal([
    { quantity: 2, unitPrice: 10 },
    { quantity: 1, unitPrice: 5.5 }
  ], 0.1)

  assert.equal(total, 28.05)
})

test('returns zero for an empty order', () => {
  assert.equal(calculateOrderTotal([]), 0)
})

test('applies a bounded discount before tax', () => {
  assert.equal(calculateOrderTotal([{ quantity: 2, unitPrice: 25 }], 0.1, 0.2), 44)
  assert.throws(
    () => calculateOrderTotal([{ quantity: 1, unitPrice: 10 }], 0, 1.01),
    /must not exceed 1/
  )
})

test('rejects invalid quantities', () => {
  assert.throws(
    () => calculateOrderTotal([{ quantity: 0, unitPrice: 10 }]),
    /positive integer/
  )
})
