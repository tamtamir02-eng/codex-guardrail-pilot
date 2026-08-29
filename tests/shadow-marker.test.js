import assert from 'node:assert/strict'
import test from 'node:test'

import { formatShadowMarker } from '../src/shadow-marker.js'

test('formats a normalized shadow marker', () => {
  assert.equal(formatShadowMarker('  YELLOW  '), 'shadow:yellow')
})

test('rejects an empty marker', () => {
  assert.throws(() => formatShadowMarker('   '), /non-empty string/)
})
