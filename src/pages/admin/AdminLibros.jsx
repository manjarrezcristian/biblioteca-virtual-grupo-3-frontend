import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ApiLibros } from '../../services/api';

const AdminLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', autor: '', isbn: '' });

  // HU08: Carga Automática de Datos Iniciales
  useEffect(() => {
    cargarLibros();
  }, []); // Arreglo de dependencias vacío para cargar solo una vez al montar

  const cargarLibros = async () => {
    try {
      setLoading(true);
      // MOCK: Aquí haríamos await ApiLibros.getAll()
      // Simulando la respuesta del servidor falso:
      setTimeout(() => {
        setLibros([
          { id: 1, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', isbn: '978-0307474728' },
          { id: 2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', isbn: '978-8420412146' }
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      Swal.fire('Error', 'No se pudieron cargar los libros', 'error');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNuevoLibro({ ...nuevoLibro, [e.target.name]: e.target.value });
  };

  const handleCrearLibro = async (e) => {
    e.preventDefault();
    try {
      // HU06: Captura de Datos usando estados
      // MOCK: await ApiLibros.create(nuevoLibro);
      
      const libroGuardado = { ...nuevoLibro, id: Date.now() };
      setLibros([...libros, libroGuardado]);
      setNuevoLibro({ titulo: '', autor: '', isbn: '' });

      // HU09: Retroalimentación Visual
      Swal.fire({
        icon: 'success',
        title: 'Libro Creado',
        text: 'El libro se ha registrado exitosamente en el sistema.',
        timer: 2000
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo registrar el libro', 'error');
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="mb-4">Gestión de Libros</h1>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Agregar Nuevo Libro</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleCrearLibro}>
                <div className="mb-3">
                  <label>Título</label>
                  <input type="text" className="form-control" name="titulo" value={nuevoLibro.titulo} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>Autor</label>
                  <input type="text" className="form-control" name="autor" value={nuevoLibro.autor} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label>ISBN</label>
                  <input type="text" className="form-control" name="isbn" value={nuevoLibro.isbn} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Guardar Libro</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">Catálogo Actual</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <p>Cargando libros...</p>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Autor</th>
                      <th>ISBN</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libros.map(libro => (
                      <tr key={libro.id}>
                        <td>{libro.id}</td>
                        <td>{libro.titulo}</td>
                        <td>{libro.autor}</td>
                        <td>{libro.isbn}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => Swal.fire('TBD', 'Funcionalidad de borrar no implementada todavía', 'info')}>Borrar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLibros;
