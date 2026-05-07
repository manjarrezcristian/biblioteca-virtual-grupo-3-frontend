import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { end_points } from '../config/endPoints';
import './BookDetail.css';



const BookDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLogged } = useAuth();
  const [book, setBook] = useState(() => {
    const stateBook = location.state?.book;
    if (stateBook) return stateBook;
    try {
      const stored = localStorage.getItem(`book-detail-${id}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReserveForm, setShowReserveForm] = useState(false);
  const [reservationSent, setReservationSent] = useState(false);
  const [formError, setFormError] = useState('');

  const today = new Date();
  const formatDate = (date) => date.toISOString().slice(0, 10);
  const maxReservaDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [form, setForm] = useState({
    fechaHoy: formatDate(today),
    fechaDevolucion: formatDate(maxReservaDate),
  });

  useEffect(() => {
    if (!book) {
      const fetchBook = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
          const data = await response.json();
          setBook(data);
        } catch {
          setError('No se pudo cargar la información del libro.');
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
    }
  }, [book, id]);

  useEffect(() => {
    if (book?.id === id) {
      try {
        localStorage.setItem(`book-detail-${id}`, JSON.stringify(book));
      } catch {
        // Ignorar errores de almacenamiento
      }
    }
  }, [book, id]);

  const volume = book?.volumeInfo || {};
  const thumbnail = volume.imageLinks?.thumbnail?.replace('http://', 'https://') || 'https://via.placeholder.com/240x360?text=Portada';

  const handleReserveClick = () => {
    if (!isLogged) {
      navigate('/login', { state: { from: `/detalle/${id}` } });
      return;
    }

    setShowReserveForm(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  const reservaDate = new Date(form.fechaHoy);
  const devolucionDate = new Date(form.fechaDevolucion);
  const maxAllowed = new Date(reservaDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  if (devolucionDate < reservaDate) {
    setFormError('La fecha de devolución no puede ser anterior a la fecha de reserva.');
    return;
  }

  if (devolucionDate > maxAllowed) {
    setFormError('La devolución debe hacerse dentro de los 7 días posteriores a la reserva.');
    return;
  }

  try {
    const userResponse = await fetch(
      `${end_points.usuarios}/${encodeURIComponent(user.id)}`
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Error obteniendo usuario:', errorText);
      throw new Error('No se pudo obtener el perfil del usuario');
    }

    const userData = await userResponse.json();
    const perfilId = userData.perfilId ?? userData.perfil?.id;

    if (!perfilId) {
      console.error('Usuario sin perfil:', userData);
      throw new Error('No se encontró el perfil asociado al usuario');
    }

    const payload = {
      libro: {
        nombreLibro: volume.title,
        cantidadPaginas: volume.pageCount || 0,
        googleId: book.id,
        descripcion: volume.description,
        thumbnail: volume.imageLinks?.thumbnail
          ? volume.imageLinks.thumbnail.replace("http://", "https://")
          : "",
        autoresTexto: (volume.authors || []).join(", ")
      },
      perfilId,
      fechaDevolucion: form.fechaDevolucion
    };
    const response = await fetch(end_points.prestamos, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error backend:', errorText);
      throw new Error("Error al guardar préstamo");
    }

    setReservationSent(true);
    setShowReserveForm(false);

  } catch (error) {
    console.error(error);
    setFormError(error.message || "No se pudo crear el préstamo");
  }
};

  return (
    <main className="detail-page">
      <Navbar />
      <div className="container mt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/catalog')}
        >
          ← Volver al catálogo
        </button>
      </div>
      <section className="detail-hero container py-5">
        {loading ? (
          <p>Cargando información del libro...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="row align-items-start gap-4">
            <div className="col-12 col-md-4 detail-cover">
              <img src={thumbnail} alt={volume.title} className="img-fluid rounded shadow-sm" />
            </div>
            <div className="col-12 col-md-7 detail-info">
              <h1>{volume.title || 'Título no disponible'}</h1>
              <h4 className="text-secondary">{(volume.authors || ['Autor no disponible']).join(', ')}</h4>
              <p className="lead mt-3">{volume.subtitle || 'Resumen del libro disponible en la descripción.'}</p>
              <div className="detail-meta row g-2 my-4">
                <div className="col-6 col-sm-4">
                  <strong>Publicado:</strong>
                  <p>{volume.publishedDate || 'N/D'}</p>
                </div>
                <div className="col-6 col-sm-4">
                  <strong>Páginas:</strong>
                  <p>{volume.pageCount || 'N/D'}</p>
                </div>
                <div className="col-6 col-sm-4">
                  <strong>Idioma:</strong>
                  <p>{volume.language?.toUpperCase() || 'N/D'}</p>
                </div>
              </div>
              <button className="btn btn-info btn-lg" onClick={handleReserveClick}>
                {isLogged ? 'Reservar libro' : 'Iniciar sesión para reservar'}
              </button>
              {reservationSent && (
                <div className="alert alert-success mt-4" role="alert">
                  ¡Reserva enviada! Te contactaremos por correo para confirmar.
                </div>
              )}
            </div>

            <div className="col-12 detail-summary mt-4">
              <h2>Descripción</h2>
              <p>{volume.description ? volume.description : 'No hay descripción disponible para este libro.'}</p>
            </div>

            <div className="col-12 col-lg-6 detail-specs mb-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Editorial:</strong> {volume.publisher || 'N/D'}
                </li>
                <li className="list-group-item">
                  <strong>Categorías:</strong> {(volume.categories || ['No especificado']).join(', ')}
                </li>
                <li className="list-group-item">
                  <strong>ISBN:</strong> {volume.industryIdentifiers?.map((item) => item.identifier).join(', ') || 'N/D'}
                </li>
                <li className="list-group-item">
                  <strong>Estado de reserva:</strong> {isLogged ? 'Disponible para reservar' : 'Necesita iniciar sesión'}
                </li>
              </ul>
            </div>

          </div>
        )}

        {showReserveForm && (
          <div className="modal-backdrop-custom" role="dialog" aria-modal="true" onClick={() => setShowReserveForm(false)}>
            <div className="modal d-block" tabIndex="-1" aria-labelledby="reservaModalLabel" onClick={(event) => event.stopPropagation()}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="reservaModalLabel">Formulario de reserva</h5>
                    <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setShowReserveForm(false)} />
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <p className="text-muted">Reserva como <strong>{user?.email || 'usuario registrado'}</strong> para este libro.</p>
                      <div className="mb-3">
                        <label htmlFor="fechaHoy" className="form-label">Fecha de reserva</label>
                        <input
                          id="fechaHoy"
                          name="fechaHoy"
                          type="date"
                          className="form-control"
                          value={form.fechaHoy}
                          onChange={handleInputChange}
                          min={formatDate(today)}
                          max={formatDate(maxReservaDate)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="fechaDevolucion" className="form-label">Fecha de devolución</label>
                        <input
                          id="fechaDevolucion"
                          name="fechaDevolucion"
                          type="date"
                          className="form-control"
                          value={form.fechaDevolucion}
                          onChange={handleInputChange}
                          min={form.fechaHoy}
                          max={formatDate(new Date(new Date(form.fechaHoy).getTime() + 7 * 24 * 60 * 60 * 1000))}
                          required
                        />
                        <div className="form-text">La devolución debe ser dentro de los 7 días después de la reserva.</div>
                      </div>
                      <div className="alert alert-secondary">
                        <h6 className="mb-2">Resumen de la reserva</h6>
                        <p className="mb-1"><strong>Usuario:</strong> {user?.email || 'Usuario registrado'}</p>
                        <p className="mb-1"><strong>Libro:</strong> {volume.title || 'Título no disponible'}</p>
                        <p className="mb-1"><strong>Fecha de reserva:</strong> {form.fechaHoy}</p>
                        <p className="mb-0"><strong>Fecha de devolución:</strong> {form.fechaDevolucion}</p>
                      </div>
                      {formError && <div className="alert alert-danger">{formError}</div>}
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowReserveForm(false)}>Cerrar</button>
                        <button type="submit" className="btn btn-info">Enviar reserva</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
};

export default BookDetail;
