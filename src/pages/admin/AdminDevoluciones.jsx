import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AdminDevoluciones = () => {
  const [devolucion, setDevolucion] = useState({ idPrestamo: '', notas: '' });

  const handleChange = (e) => {
    setDevolucion({ ...devolucion, [e.target.name]: e.target.value });
  };

  const handleDevolucion = (e) => {
    e.preventDefault();
    // Simula lógica de devolución
    Swal.fire({
      icon: 'success',
      title: 'Devolución Registrada',
      text: `Se ha procesado exitosamente la devolución número: ${devolucion.idPrestamo}`,
    });
    setDevolucion({ idPrestamo: '', notas: '' });
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Registro de Devoluciones</h1>
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Procesar Devolución</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleDevolucion}>
            <div className="mb-3">
              <label>ID del Préstamo a Devolver</label>
              <input type="text" className="form-control" name="idPrestamo" value={devolucion.idPrestamo} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Notas o Estado del Libro (Opcional)</label>
              <textarea className="form-control" name="notas" rows="3" value={devolucion.notas} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="btn btn-success w-100">Registrar Devolución</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDevoluciones;
