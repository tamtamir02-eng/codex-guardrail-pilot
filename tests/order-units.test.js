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

test('rejects inherited items in sparse arrays', () => {
  const items = Array(1)
  Object.setPrototypeOf(items, { 0: { quantity: 7 } })

  assert.throws(
    () => countOrderUnits(items),
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

test('reads each quantity only once', () => {
  let reads = 0
  const item = {
    get quantity() {
      reads += 1
      return reads === 1 ? 1 : Number.MAX_VALUE
    }
  }

  assert.equal(countOrderUnits([item]), 1)
  assert.equal(reads, 1)
})

test('validates the original number of order lines', () => {
  const items = [{}, { quantity: 2 }]
  Object.defineProperty(items[0], 'quantity', {
    get() {
      items.length = 1
      return 1
    }
  })

  assert.equal(countOrderUnits(items), 3)
})

test('validates every slot before invoking quantity accessors', () => {
  const items = [
    {
      get quantity() {
        items[1] = { quantity: 2 }
        return 1
      }
    },
    ,
  ]

  assert.throws(
    () => countOrderUnits(items),
    /items\[1\] must be present/
  )
})

test('rejects indexed getters before they can replace later entries', () => {
  const items = [{ quantity: 1 }, { quantity: 2 }]
  Object.defineProperty(items, 0, {
    get() {
      delete items[1]
      return { quantity: 1 }
    }
  })

  assert.throws(
    () => countOrderUnits(items),
    /items\[0\] must be a data property/
  )
})
