import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const NotFound = () => (
  <main className="notfound-page">
    <Navbar />
    <section className="container py-5 text-center">
      <h1>Página no encontrada</h1>
      <p>No pudimos encontrar esa ruta. Regresa al inicio o al catálogo.</p>
      <Link to="/" className="btn btn-outline-primary me-2">
        Inicio
      </Link>
      <Link to="/catalog" className="btn btn-outline-success">
        Catálogo
      </Link>
    </section>
    <Footer />
  </main>
);

export default NotFound;
