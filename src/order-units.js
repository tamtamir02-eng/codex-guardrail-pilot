export function countOrderUnits(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array')
  }

  let total = 0
  const itemCount = items.length

  for (let index = 0; index < itemCount; index += 1) {
    if (!Object.hasOwn(items, index)) {
      throw new TypeError(`items[${index}] must be present`)
    }

    const item = items[index]
    const quantity = item?.quantity

    if (!Number.isSafeInteger(quantity) || quantity <= 0) {
      throw new TypeError(`items[${index}].quantity must be a positive integer`)
    }

    if (!Number.isSafeInteger(total + quantity)) {
      throw new RangeError('total quantity exceeds the safe integer range')
    }

    total += quantity
  }

  return total
}
