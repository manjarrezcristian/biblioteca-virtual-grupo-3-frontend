import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { clearAuthData, getUser } from '../helpers/auth';
import Swal from 'sweetalert2';
import './AdminLayout.css'; // Crearemos este archivo para los estilos de la barra lateral

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = getUser() || { nombre: 'Administrador' };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Se cerrará tu sesión actual',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        clearAuthData();
        navigate('/login');
      }
    });
  };

  return (
    <div className="admin-layout-container">
      {/* Sidebar Lateral */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <span className="sidebar-user">Hola, {user.nombre}</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/libros" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Libros
          </NavLink>
          <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Usuarios
          </NavLink>
          <NavLink to="/admin/administradores" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Administradores
          </NavLink>
          <NavLink to="/admin/prestamos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Préstamos
          </NavLink>
          <NavLink to="/admin/devoluciones" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Devoluciones
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
