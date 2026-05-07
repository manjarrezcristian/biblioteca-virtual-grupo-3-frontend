import { Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user, isLogged } = useAuth()

  if (!isLogged) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="profile-page">
      <Navbar />
      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card p-4 shadow-sm">
              <h1 className="mb-4">Perfil de usuario</h1>
              <p className="mb-2">
                <strong>Nombre:</strong> {user.name}
              </p>
              <p className="mb-2">
                <strong>Correo:</strong> {user.email}
              </p>
              <p className="text-muted">
                Esta es tu cuenta de usuario en la biblioteca virtual. Puedes navegar por el catálogo, leer el blog y reservar libros.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default Profile
