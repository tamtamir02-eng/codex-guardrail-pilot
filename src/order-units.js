export function countOrderUnits(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array')
  }

  let total = 0

  for (let index = 0; index < items.length; index += 1) {
    if (!(index in items)) {
      throw new TypeError(`items[${index}] must be present`)
    }

    const item = items[index]

    if (!item || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
      throw new TypeError(`items[${index}].quantity must be a positive integer`)
    }

    if (!Number.isSafeInteger(total + item.quantity)) {
      throw new RangeError('total quantity exceeds the safe integer range')
    }

    total += item.quantity
  }

  return total
}
