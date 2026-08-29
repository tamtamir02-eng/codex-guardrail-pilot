export function formatShadowMarker(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError('value must be a non-empty string')
  }

  return `shadow:${value.trim().toLowerCase()}`
}
