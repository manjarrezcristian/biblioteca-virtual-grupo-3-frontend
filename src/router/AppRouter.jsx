import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Componentes y Vistas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminLayout from '../components/AdminLayout';

import AdminLibros from '../pages/admin/AdminLibros';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import AdminAdministradores from '../pages/admin/AdminAdministradores';
import AdminPrestamos from '../pages/admin/AdminPrestamos';
import AdminDevoluciones from '../pages/admin/AdminDevoluciones';

// HU05: Enrutamiento Base
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'libros',
        element: <AdminLibros />
      },
      {
        path: 'usuarios',
        element: <AdminUsuarios />
      },
      {
        path: 'administradores',
        element: <AdminAdministradores />
      },
      {
        path: 'prestamos',
        element: <AdminPrestamos />
      },
      {
        path: 'devoluciones',
        element: <AdminDevoluciones />
      }
    ]
  },
  {
    path: '*',
    element: <Home /> // Redirect to Home or a 404 Not Found page
  }
]);
