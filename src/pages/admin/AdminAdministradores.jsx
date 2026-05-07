import React, { useState, useEffect } from 'react';

const AdminAdministradores = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAdmins([
        { id: 1, nombre: 'Super Admin', rol: 'SUDO', estado: 'Activo' },
        { id: 2, nombre: 'Admin Ventas', rol: 'MODERATOR', estado: 'Activo' }
      ]);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Gestión de Administradores</h1>
      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white">
          <h5 className="mb-0">Administradores del Sistema</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Cargando administradores...</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Rol Especial</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.nombre}</td>
                    <td><span className="badge bg-warning text-dark">{a.rol}</span></td>
                    <td>{a.estado}</td>
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

export default AdminAdministradores;
