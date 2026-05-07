/**
 * @param {unknown} rol
 * @returns {string}
 */
export function descripcionRol(rol) {
  if (rol == null || typeof rol !== 'object') return ''
  const d = /** @type {{ descripcion?: string }} */ (rol).descripcion
  return typeof d === 'string' ? d.trim() : ''
}

/** @param {unknown} rol */
export function esRolAdmin(rol) {
  return descripcionRol(rol).toUpperCase() === 'ADMIN'
}

/**
 * @param {Array<{ id?: number, descripcion?: string }>} roles
 * @param {string} nombre case-insensitive
 * @returns {number | null}
 */
export function idRolPorNombre(roles, nombre) {
  const target = nombre.trim().toUpperCase()
  const found = roles.find((r) => (r.descripcion ?? '').toString().trim().toUpperCase() === target)
  return typeof found?.id === 'number' ? found.id : null
}
