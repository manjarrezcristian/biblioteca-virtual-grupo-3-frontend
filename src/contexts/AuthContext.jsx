import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { cerrarSesion, obtenerSesion, guardarSesion, SESSION_EVENT } from '../helpers/session';

const AuthContext = createContext(null);
const AUTH_KEY = 'biblioteca-auth';

const normalizeUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== 'object') {
    return null;
  }

  const id = rawUser.id ?? rawUser.email ?? null;
  const email = typeof rawUser.email === 'string' ? rawUser.email : '';
  if (!id || !email) {
    return null;
  }

  const fallbackName = email.split('@')[0] || 'Usuario';
  return {
    id,
    email,
    name:
      typeof rawUser.name === 'string' && rawUser.name.trim()
        ? rawUser.name
        : fallbackName,
    rolDescripcion:
      typeof rawUser.rolDescripcion === 'string' ? rawUser.rolDescripcion : '',
  };
};

const readStoredUser = () => {
  const sessionUser = normalizeUser(obtenerSesion());
  if (sessionUser) {
    return sessionUser;
  }

  try {
    return normalizeUser(JSON.parse(localStorage.getItem(AUTH_KEY)));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }, [user]);

  useEffect(() => {
    const syncUser = () => setUser(readStoredUser());
    window.addEventListener('storage', syncUser);
    window.addEventListener(SESSION_EVENT, syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener(SESSION_EVENT, syncUser);
    };
  }, []);

  const login = (value) => {
    const nextUser =
      typeof value === 'string'
        ? normalizeUser({
            id: value.trim().toLowerCase(),
            email: value,
          })
        : normalizeUser(value);

    if (!nextUser) {
      return;
    }

    guardarSesion({
      id: nextUser.id,
      email: nextUser.email,
      name: nextUser.name,
      rolDescripcion: nextUser.rolDescripcion,
    });
    setUser(nextUser);
  };

  const logout = () => {
    cerrarSesion();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, logout, isLogged: Boolean(user) }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
