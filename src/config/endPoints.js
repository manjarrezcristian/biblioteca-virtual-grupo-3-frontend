const API_URL = 'https://biblioteca-virtual-grupo-3.onrender.com'
const base = (import.meta.env.VITE_API_URL || API_URL).replace(/\/$/, '')

const withBase = (path) => (base ? `${base}${path}` : path)

export const end_points = {
  usuarios: withBase('/usuarios'),
  perfiles: withBase('/perfiles'),
  roles: withBase('/roles'),
  prestamos: withBase('/prestamos'),
  prestamosPorPerfil: (perfilId) => withBase(`/prestamos/perfil/${perfilId}`),
  librosPrestadosPorPerfil: (perfilId) => withBase(`/perfiles/${perfilId}/libros-prestados`),
}
