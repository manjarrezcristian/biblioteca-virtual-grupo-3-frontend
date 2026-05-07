import Swal from 'sweetalert2'

const defaults = {
  confirmButtonText: 'Aceptar',
  confirmButtonColor: '#0dcaf0',
}

export const showSuccess = (text, title = 'Éxito') =>
  Swal.fire({
    icon: 'success',
    title,
    text,
    ...defaults,
  })

export const showError = (text, title = 'Error') =>
  Swal.fire({
    icon: 'error',
    title,
    text,
    ...defaults,
  })

export const showWarning = (text, title = 'Atención') =>
  Swal.fire({
    icon: 'warning',
    title,
    text,
    ...defaults,
  })

export const showInfo = (text, title = 'Información') =>
  Swal.fire({
    icon: 'info',
    title,
    text,
    ...defaults,
  })

/**
 * Obtiene el mensaje legible de una respuesta JSON típica de la API.
 * @param {unknown} data
 * @returns {string}
 */
export const getApiMessage = (data) => {
  if (data == null) return ''
  if (typeof data === 'string') return data
  if (typeof data === 'object') {
    return (
      data.message ??
      data.mensaje ??
      data.error ??
      data.detail ??
      (Array.isArray(data.errors) ? data.errors.join(' ') : '') ??
      ''
    )
  }
  return ''
}

/**
 * Muestra una alerta según el resultado HTTP y el cuerpo (ej. "Registro creado con éxito", "Usuario incorrecto").
 * @param {Response} response
 * @param {unknown} [data] Cuerpo ya parseado como JSON; si se omite, se intenta leer de la respuesta.
 * @returns {Promise<unknown>}
 */
export const notifyApiResult = async (response, data) => {
  let body = data
  if (body === undefined) {
    try {
      const clone = response.clone()
      body = await clone.json()
    } catch {
      body = {}
    }
  }
  const msg = getApiMessage(body)
  if (response.ok) {
    return showSuccess(msg || 'Operación realizada correctamente.')
  }
  return showError(msg || 'No se pudo completar la operación.', 'Algo salió mal')
}
