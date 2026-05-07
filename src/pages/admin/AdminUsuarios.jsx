import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando carga de datos desde el backend
    setTimeout(() => {
      setUsuarios([
        { id: 1, nombre: 'Ana Gómez', email: 'ana@example.com', estado: 'Activo' },
        { id: 2, nombre: 'Luis Carlos', email: 'luis@example.com', estado: 'Inactivo' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Gestión de Usuarios</h1>
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Listado de Usuarios</h5>
          <button className="btn btn-sm btn-success" onClick={() => Swal.fire('Información', 'Módulo de creación en desarrollo', 'info')}>Nuevo Usuario</button>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : (
             <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>
                       <span className={`badge ${u.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                         {u.estado}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsuarios;
