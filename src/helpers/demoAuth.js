const CURRENT_USER_KEY = 'bibliotecaVirtualCurrentUser';

export const demoUsers = [
  { id: 'u1', name: 'Ana Garcia' },
  { id: 'u2', name: 'Carlos Perez' },
  { id: 'u3', name: 'Luisa Martinez' },
];

export const getCurrentUser = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedId = window.localStorage.getItem(CURRENT_USER_KEY);
  return demoUsers.find((user) => user.id === storedId) || null;
};

export const setCurrentUser = (userId) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CURRENT_USER_KEY, userId);
};

export const clearCurrentUser = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(CURRENT_USER_KEY);
};
