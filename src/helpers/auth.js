// src/helpers/auth.js
// HU10: Persistencia de Sesión y Preferencias

/**
 * Guarda el token de sesión y datos del usuario en localStorage
 */
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

/**
 * Obtiene el token actual
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Obtiene el usuario parseado, o null si no existe
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Cierra la sesión limpiando el almacenamiento
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Se podría guardar el tema visual si se quisiera, por ejemplo no borrando todo
};
