export function countOrderUnits(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array')
  }

  return items.reduce((total, item, index) => {
    if (!item || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new TypeError(`items[${index}].quantity must be a positive integer`)
    }

    return total + item.quantity
  }, 0)
}
