import { Link, useNavigate } from 'react-router-dom'
import { FaRegUserCircle } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import './navbar.css'
import Logo from '../assets/Logo.png'

const Navbar = () => {
  const auth = useAuth()
  const navigate = useNavigate()
  const displayName = auth.user?.name || auth.user?.email?.split('@')[0] || 'Usuario'
  const profilePath = auth.user?.rolDescripcion?.toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/perfil'

  const handleLogout = () => {
    auth.logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg blog-navbar">
      <div className="container-fluid blog-navbar__container">
        <div className="d-flex align-items-center blog-navbar__brand">
          <img
            src={Logo}
            alt="Logo"
            width="70"
            height="50"
            className="d-inline-block align-text-top me-2 blog-navbar__logo"
          />
          <span className="navbar-brand mb-0 h1">Biblioteca Virtual</span>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
          <div className="navbar-nav text-center blog-navbar__links">
            <Link className="nav-link active" aria-current="page" to="/">
              Home
            </Link>
            <Link className="nav-link" to="/catalog">
              Catálogo
            </Link>
            <Link className="nav-link" to="/blog">
              Blog
            </Link>
            {auth.isLogged && (
              <Link className="nav-link" to="/crear-post">
                Crear
              </Link>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center blog-navbar__session">
          {auth.isLogged ? (
            <>
              <Link to={profilePath} className="blog-navbar__profile" aria-label="Ir al perfil">
                <span className="blog-navbar__profile-icon" aria-hidden="true">
                  <FaRegUserCircle />
                </span>
                <span className="blog-navbar__profile-copy">
                  <strong>{displayName}</strong>
                </span>
              </Link>
              <button type="button" className="blog-navbar__logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link className="blog-navbar__login" to="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
