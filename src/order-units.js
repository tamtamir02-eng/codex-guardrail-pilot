export function countOrderUnits(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array')
  }

  let total = 0
  const itemCount = items.length
  const itemDescriptors = Object.getOwnPropertyDescriptors(items)
  const orderLines = []

  for (let index = 0; index < itemCount; index += 1) {
    const descriptor = itemDescriptors[index]

    if (!descriptor) {
      throw new TypeError(`items[${index}] must be present`)
    }

    if (!Object.hasOwn(descriptor, 'value')) {
      throw new TypeError(`items[${index}] must be a data property`)
    }

    orderLines.push(descriptor.value)
  }

  for (let index = 0; index < itemCount; index += 1) {
    const item = orderLines[index]
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
