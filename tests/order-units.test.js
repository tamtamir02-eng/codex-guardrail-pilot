import assert from 'node:assert/strict'
import test from 'node:test'

import { countOrderUnits } from '../src/order-units.js'

test('counts units across order lines', () => {
  assert.equal(countOrderUnits([
    { quantity: 2 },
    { quantity: 3 }
  ]), 5)
})

test('returns zero for an empty order', () => {
  assert.equal(countOrderUnits([]), 0)
})

test('rejects invalid quantities', () => {
  assert.throws(
    () => countOrderUnits([{ quantity: 0 }]),
    /positive integer/
  )
})
