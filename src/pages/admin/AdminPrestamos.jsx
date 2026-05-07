import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AdminPrestamos = () => {
  const [prestamo, setPrestamo] = useState({ userId: '', libroId: '', fechaDevolucion: '' });

  const handleChange = (e) => {
    setPrestamo({ ...prestamo, [e.target.name]: e.target.value });
  };

  const handlePrestamo = (e) => {
    e.preventDefault();
    // Simula lógica de préstamo
    Swal.fire({
      icon: 'success',
      title: 'Préstamo Registrado',
      text: `Se ha registrado el préstamo del libro ID: ${prestamo.libroId} al usuario ID: ${prestamo.userId}`,
    });
    setPrestamo({ userId: '', libroId: '', fechaDevolucion: '' });
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Registro de Préstamos</h1>
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Nuevo Préstamo</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handlePrestamo}>
            <div className="mb-3">
              <label>ID del Usuario</label>
              <input type="text" className="form-control" name="userId" value={prestamo.userId} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>ID del Libro</label>
              <input type="text" className="form-control" name="libroId" value={prestamo.libroId} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Fecha Estimada de Devolución</label>
              <input type="date" className="form-control" name="fechaDevolucion" value={prestamo.fechaDevolucion} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-info w-100 text-white">Registrar Préstamo</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPrestamos;
