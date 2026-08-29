function requireFiniteNonNegative(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    throw new TypeError(`${label} must be a finite non-negative number`)
  }
}

export function calculateOrderTotal(items, taxRate = 0) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array')
  }
  requireFiniteNonNegative(taxRate, 'taxRate')

  const subtotal = items.reduce((sum, item, index) => {
    if (!item || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new TypeError(`items[${index}].quantity must be a positive integer`)
    }
    requireFiniteNonNegative(item.unitPrice, `items[${index}].unitPrice`)
    return sum + item.quantity * item.unitPrice
  }, 0)

  return Number((subtotal * (1 + taxRate)).toFixed(2))
}
