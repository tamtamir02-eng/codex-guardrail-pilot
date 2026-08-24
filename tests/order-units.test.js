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

test('rejects sparse order arrays', () => {
  assert.throws(
    () => countOrderUnits(Array(1)),
    /must be present/
  )
})

test('rejects totals outside the safe integer range', () => {
  assert.throws(
    () => countOrderUnits([
      { quantity: Number.MAX_SAFE_INTEGER },
      { quantity: 2 }
    ]),
    /safe integer range/
  )
})
