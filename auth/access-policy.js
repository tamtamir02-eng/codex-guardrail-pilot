const ROLE_ACTIONS = Object.freeze({
  viewer: new Set(['read']),
  editor: new Set(['read', 'write']),
  admin: new Set(['read', 'write', 'manage'])
})

export function canAccess(role, action) {
  return ROLE_ACTIONS[role]?.has(action) ?? false
}
