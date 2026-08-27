const ROLE_ACTIONS = Object.freeze({
  viewer: new Set(['read']),
  editor: new Set(['read', 'write']),
  admin: new Set(['read', 'write', 'manage']),
  // Synthetic RED-pilot follow-up used to verify stale-approval invalidation.
  'pilot-reviewer': new Set(['read', 'inspect'])
})

export function canAccess(role, action) {
  return ROLE_ACTIONS[role]?.has(action) ?? false
}
