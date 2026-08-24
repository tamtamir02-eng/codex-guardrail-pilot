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

test('rejects quantity getters', () => {
  const item = {
    get quantity() {
      return 1
    }
  }

  assert.throws(
    () => countOrderUnits([item]),
    /own data property/
  )
})

test('rejects quantity getters that mutate the original array', () => {
  const items = [{}, { quantity: 2 }]
  Object.defineProperty(items[0], 'quantity', {
    get() {
      items.length = 1
      return 1
    }
  })

  assert.throws(
    () => countOrderUnits(items),
    /own data property/
  )
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

test('rejects inherited descriptors after prototype pollution', () => {
  Object.defineProperty(Object.prototype, '0', {
    configurable: true,
    value: { value: { quantity: 7 } }
  })

  try {
    assert.throws(
      () => countOrderUnits(Array(1)),
      /items\[0\] must be present/
    )
  } finally {
    delete Object.prototype[0]
  }
})

test('rejects inherited quantities after prototype pollution', () => {
  Object.defineProperty(Object.prototype, 'quantity', {
    configurable: true,
    value: 7
  })

  try {
    assert.throws(
      () => countOrderUnits([{}]),
      /own data property/
    )
  } finally {
    delete Object.prototype.quantity
  }
})

test('rejects proxied arrays that lie about their length', () => {
  const items = new Proxy([
    { quantity: 1 },
    { quantity: 2 }
  ], {
    get(target, property, receiver) {
      if (property === 'length') return 0
      return Reflect.get(target, property, receiver)
    }
  })

  assert.throws(
    () => countOrderUnits(items),
    /plain array/
  )
})

test('rejects proxied order lines', () => {
  const item = new Proxy({ quantity: 1 }, {})

  assert.throws(
    () => countOrderUnits([item]),
    /must not be a proxy/
  )
})
