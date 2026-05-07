import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { end_points } from '../config/endPoints'
import { obtenerSesion, cerrarSesion } from '../helpers/session'
import './UserProfile.css'

const UserProfile = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const session = useMemo(() => obtenerSesion(), [])

  useEffect(() => {
    if (!session) {
      navigate('/login')
      return
    }

    let cancelled = false
    const loadProfile = async () => {
      try {
        const resUsuario = await fetch(`${end_points.usuarios}/${encodeURIComponent(session.id)}`)
        if (!resUsuario.ok) {
          throw new Error('No se pudo cargar la información del usuario.')
        }

        const currentUser = await resUsuario.json()
        if (!currentUser) {
          setProfile({
            email: session.email,
            rolDescripcion: session.rolDescripcion,
          })
          return
        }

        const perfilId = currentUser.perfilId ?? currentUser.perfil?.id
        if (!perfilId) {
          console.warn('No hay perfilId disponible')
          setProfile({
            email: session.email,
            rolDescripcion: session.rolDescripcion,
            ...currentUser,
          })
          return
        }

        const resPerfil = await fetch(`${end_points.perfiles}/${perfilId}`)
        if (!resPerfil.ok) {
          console.warn('Error al obtener perfil:', resPerfil.status)
          setProfile({
            email: session.email,
            rolDescripcion: session.rolDescripcion,
            ...currentUser,
          })
          return
        }

        const perfilData = await resPerfil.json()
        if (!cancelled) {
          setProfile({
            email: session.email,
            rolDescripcion: session.rolDescripcion,
            ...perfilData,
            ...currentUser,
          })

          // Cargar préstamos específicos del perfil
          try {
            const prestamosUrls = [
              end_points.prestamosPorPerfil(perfilId),
              end_points.librosPrestadosPorPerfil(perfilId),
            ]

            let resPrestamos = null
            for (const urlPrestamos of prestamosUrls) {
              resPrestamos = await fetch(urlPrestamos)
              if (resPrestamos.ok) break
            }

            if (resPrestamos.ok) {
              const contentType = resPrestamos.headers.get('content-type') ?? ''
              const prestamosData = contentType.includes('application/json')
                ? await resPrestamos.json()
                : null
              
              const prestamosArray = Array.isArray(prestamosData)
                ? prestamosData
                : prestamosData?.content ?? prestamosData?.prestamos ?? prestamosData?.data ?? []
              
              if (!cancelled) {
                setLoans(prestamosArray)
              }
            } else {
              console.warn('Error al obtener préstamos, status:', resPrestamos.status)
              const errorText = await resPrestamos.text()
              console.warn('Error detail:', errorText)
            }
          } catch (error) {
            console.warn('Excepción al cargar préstamos:', error)
            setLoans([])
          }
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setProfile({
            email: session.email,
            rolDescripcion: session.rolDescripcion,
          })
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [navigate, session])

  if (!session) return null

  const handleLogout = () => {
    cerrarSesion()
    navigate('/login')
  }

  const nombreCompleto = profile?.nombre
    ? `${profile.nombre} ${profile.apellido ?? ''}`.trim()
    : profile?.firstName
    ? `${profile.firstName} ${profile.lastName ?? ''}`.trim()
    : profile?.email ?? 'Usuario'

  const initials = nombreCompleto
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase() ?? '')
    .join('')

  const infoItems = [
    { label: 'Correo', value: profile?.email ?? session.email ?? '-' },
    { label: 'Rol', value: profile?.rolDescripcion ?? session.rolDescripcion ?? 'No disponible' },
    { label: 'Tipo de documento', value: profile?.tipoDocumento ?? profile?.documentType ?? '-' },
    { label: 'Número de documento', value: profile?.numeroDocumento ?? profile?.documentNumber ?? '-' },
    { label: 'Nombre', value: profile?.nombre ?? profile?.firstName ?? '-' },
    { label: 'Apellido', value: profile?.apellido ?? profile?.lastName ?? '-' },
    { label: 'Dirección', value: profile?.direccion ?? profile?.address ?? '-' },
    { label: 'Teléfono', value: profile?.telefono ?? profile?.phone ?? '-' },
  ]

  const statusCards = [
    { label: 'Sesión', value: profile?.email ?? session.email ?? '-', accent: 'sky' },
    { label: 'Rol activo', value: profile?.rolDescripcion ?? session.rolDescripcion ?? 'No disponible', accent: 'sun' },
    { label: 'Estado', value: loading ? 'Cargando...' : 'Activo', accent: 'mint' },
  ]

  return (
    <div className="perfil-page">
      <section className="perfil-hero">
        <div className="perfil-hero__glow perfil-hero__glow--one"></div>
        <div className="perfil-hero__glow perfil-hero__glow--two"></div>

        <div className="container perfil-hero__content">
          <div className="perfil-hero__topbar">
            <Link to="/" className="perfil-link">
              Volver al inicio
            </Link>
            <button type="button" className="perfil-btn perfil-btn--ghost" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>

          <div className="perfil-hero__grid">
            <article className="perfil-card perfil-card--identity">
              <div className="perfil-avatar" aria-hidden="true">
                <span>{initials || 'U'}</span>
              </div>

              <div className="perfil-identity__body">
                <p className="perfil-eyebrow">Perfil de usuario</p>
                <h1>{nombreCompleto}</h1>
                <p className="perfil-copy">
                  Revisa tus datos principales, el estado de tu cuenta y un resumen rápido de tu actividad.
                </p>

                <div className="perfil-chip-row">
                  <span className="perfil-chip">{profile?.rolDescripcion ?? session.rolDescripcion ?? 'Sin rol'}</span>
                  <span className="perfil-chip perfil-chip--soft">
                    {loading ? 'Actualizando información...' : 'Información sincronizada'}
                  </span>
                </div>
              </div>
            </article>

            <div className="perfil-status-grid">
              {statusCards.map((card) => (
                <article key={card.label} className={`perfil-card perfil-card--status perfil-card--${card.accent}`}>
                  <p>{card.label}</p>
                  <strong>{card.value}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="container perfil-main">
        <section className="perfil-layout">
          <article className="perfil-card perfil-card--details">
            <div className="perfil-section-header">
              <div>
                <p className="perfil-eyebrow">Información personal</p>
                <h2>Datos del usuario</h2>
              </div>
              <span className="perfil-badge">ID {profile?.id ?? '-'}</span>
            </div>

            <div className="perfil-details-grid">
              {infoItems.map((item) => (
                <div key={item.label} className="perfil-detail">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <aside className="perfil-sidebar">
            <article className="perfil-card perfil-card--summary">
              <p className="perfil-eyebrow">Resumen rápido</p>
              <h3>Tu cuenta en un vistazo</h3>
              <ul className="perfil-summary-list">
                <li>
                  <span>Préstamos recientes</span>
                  <strong>{loans.length}</strong>
                </li>
                <li>
                  <span>Estado de acceso</span>
                  <strong>{loading ? 'Verificando' : 'Activo'}</strong>
                </li>
                <li>
                  <span>Ruta principal</span>
                  <strong>{profile?.rolDescripcion?.toUpperCase() === 'ADMIN' ? 'Administración' : 'Usuario'}</strong>
                </li>
              </ul>
            </article>

            <article className="perfil-card perfil-card--actions">
              <p className="perfil-eyebrow">Acciones</p>
              <h3>Navegación rápida</h3>
              <div className="perfil-action-list">
                <Link to="/" className="perfil-btn perfil-btn--primary">
                  Ir al inicio
                </Link>
                <Link to="/catalog" className="perfil-btn perfil-btn--secondary">
                  Explorar catálogo
                </Link>
              </div>
            </article>
          </aside>
        </section>

        <section className="perfil-card perfil-card--loans">
          <div className="perfil-section-header">
            <div>
              <p className="perfil-eyebrow">Actividad</p>
              <h2>Préstamos recientes</h2>
            </div>
          </div>

          {loans.length > 0 ? (
            <div className="table-responsive">
              <table className="table perfil-table mb-0">
                <thead>
                  <tr>
                    <th>Libro</th>
                    <th>Fecha préstamo</th>
                    <th>Fecha devolución</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={`${loan.id}-${loan.libro?.id || 'no-book'}-${loan.fechaPrestamo}`}>
                      <td>{loan.libro?.titulo || loan.libro?.nombreLibro || 'Sin título'}</td>
                      <td>{loan.fechaPrestamo || '-'}</td>
                      <td>{loan.fechaDevolucion || '-'}</td>
                      <td>
                        <span
                          className={`perfil-status-pill perfil-status-pill--${(loan.estado || 'pendiente')
                            .toLowerCase()
                            .replaceAll(' ', '-')}`}
                        >
                          {loan.estado || 'Pendiente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <p>Cargando préstamos...</p>
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              <p>No tienes préstamos registrados en el sistema.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default UserProfile
