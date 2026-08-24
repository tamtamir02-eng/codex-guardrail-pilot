import { types as utilTypes } from 'node:util'

export function countOrderUnits(items) {
  if (!Array.isArray(items) || utilTypes.isProxy(items)) {
    throw new TypeError('items must be a plain array')
  }

  let total = 0
  const itemCount = items.length
  const itemDescriptors = Object.getOwnPropertyDescriptors(items)
  const orderLines = []

  for (let index = 0; index < itemCount; index += 1) {
    if (!Object.hasOwn(itemDescriptors, index)) {
      throw new TypeError(`items[${index}] must be present`)
    }

    const descriptor = itemDescriptors[index]

    if (!Object.hasOwn(descriptor, 'value')) {
      throw new TypeError(`items[${index}] must be a data property`)
    }

    orderLines.push(descriptor.value)
  }

  for (let index = 0; index < itemCount; index += 1) {
    const item = orderLines[index]

    if (utilTypes.isProxy(item)) {
      throw new TypeError(`items[${index}] must not be a proxy`)
    }

    const quantityDescriptor = item == null
      ? undefined
      : Object.getOwnPropertyDescriptor(item, 'quantity')

    if (!quantityDescriptor || !Object.hasOwn(quantityDescriptor, 'value')) {
      throw new TypeError(`items[${index}].quantity must be an own data property`)
    }

    const quantity = quantityDescriptor.value

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
