// src/services/api.js
// HU07: Abstracción de Red

// URL Base del Backend. Cámbiala cuando tengas el servidor desplegado.
const BASE_URL = 'http://localhost:8080/api'; 
// En caso de que uses otro puerto, modifícalo arriba.

/**
 * Función genérica para realizar llamadas a la API
 * @param {string} endpoint - La ruta a consultar (ej. '/libros', '/auth/login')
 * @param {object} options - Opciones de la petición (method, body, etc)
 * @returns {Promise<any>}
 */
export const fetchApi = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Se puede inyectar el token aquí si ya está guardado en localStorage
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición de red');
    }

    return data;
  } catch (error) {
    console.error(`Error en API (${endpoint}):`, error);
    throw error;
  }
};

// --- Endpoints Específicos para Admin (Mocks Iniciales Preparados) ---

export const ApiLibros = {
  getAll: () => fetchApi('/libros', { method: 'GET' }),
  create: (bookData) => fetchApi('/libros', { method: 'POST', body: JSON.stringify(bookData) }),
  // update, delete...
};

export const ApiUsuarios = {
  getAll: () => fetchApi('/usuarios', { method: 'GET' }),
  create: (userData) => fetchApi('/usuarios', { method: 'POST', body: JSON.stringify(userData) }),
};

export const ApiAutenticacion = {
  login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) })
};
