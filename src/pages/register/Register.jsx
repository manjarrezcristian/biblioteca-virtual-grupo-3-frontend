import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Logo from '../../assets/Logo.png'
import Footer from '../../components/Footer'
import { end_points } from '../../config/endPoints'
import { idRolPorNombre } from '../../helpers/roles'
import { notifyApiResult, showError, showWarning, showInfo } from '../../helpers/alerts'
import './Register.css'

const DEFAULT_ROLE_IDS = {
  ADMIN: 1,
  USUARIO: 2,
}

const emptyForm = () => ({
  documentType: '',
  documentNumber: '',
  firstName: '',
  lastName: '',
  address: '',
  phone: '',
  email: '',
  password: '',
})

const Register = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const registroInicial = searchParams.get('registroInicial') === '1'

  const [form, setForm] = useState(emptyForm)
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const setField = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function crearRolSiFalta(nombre) {
    try {
      const res = await fetch(end_points.roles, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion: nombre }),
      })
      if (!res.ok) return null
      const data = await res.json()
      return typeof data?.id === 'number' ? data.id : null
    } catch {
      return null
    }
  }

  async function refrescarRoles() {
    try {
      const res = await fetch(end_points.roles)
      if (!res.ok) return Array.isArray(roles) ? roles : []
      const data = await res.json()
      const listR = Array.isArray(data) ? data : data?.roles ?? data?.content ?? []
      const nuevosRoles = Array.isArray(listR) ? listR : []
      setRoles(nuevosRoles)
      return nuevosRoles
    } catch {
      return Array.isArray(roles) ? roles : []
    }
  }

  async function crearRolesBasicosSiFaltan() {
    const rolesNecesarios = ['ADMIN', 'USUARIO']
    const rolesActuales = Array.isArray(roles) ? roles : []
    const faltantes = rolesNecesarios.filter((nombre) => idRolPorNombre(rolesActuales, nombre) == null)
    if (faltantes.length === 0) return rolesActuales

    const creados = []
    for (const nombre of faltantes) {
      const id = await crearRolSiFalta(nombre)
      if (id != null) {
        creados.push({ id, descripcion: nombre })
      }
    }

    if (creados.length > 0) {
      const nuevosRoles = [...rolesActuales, ...creados]
      setRoles(nuevosRoles)
      await showInfo(
        'Roles básicos creados automáticamente: ADMIN y/o USUARIO.',
        'Roles disponibles',
      )
      return nuevosRoles
    }

    return rolesActuales
  }

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const [resUsuarios, resRoles] = await Promise.all([
          fetch(end_points.usuarios),
          fetch(end_points.roles),
        ])
        let dataUsuarios = {}
        let dataRoles = {}
        try {
          dataUsuarios = await resUsuarios.json()
        } catch {
          dataUsuarios = {}
        }
        try {
          dataRoles = await resRoles.json()
        } catch {
          dataRoles = {}
        }
        if (!resUsuarios.ok) {
          if (!cancelled) {
            setUsuarios([])
            await notifyApiResult(resUsuarios, dataUsuarios)
          }
        } else if (!cancelled) {
          const listU = Array.isArray(dataUsuarios)
            ? dataUsuarios
            : dataUsuarios?.usuarios ?? dataUsuarios?.content ?? []
          setUsuarios(Array.isArray(listU) ? listU : [])
        }
        if (!resRoles.ok) {
          if (!cancelled) {
            setRoles([])
            await notifyApiResult(resRoles, dataRoles)
          }
        } else if (!cancelled) {
          const listR = Array.isArray(dataRoles) ? dataRoles : dataRoles?.roles ?? dataRoles?.content ?? []
          setRoles(Array.isArray(listR) ? listR : [])
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setUsuarios([])
          setRoles([])
          await showError(
            error instanceof Error ? error.message : 'Comprueba tu conexión e inténtalo de nuevo.',
            'Sin conexión',
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  function isFormComplete() {
    const f = form
    return (
      f.documentType &&
      f.documentNumber.trim() &&
      f.firstName.trim() &&
      f.lastName.trim() &&
      f.address.trim() &&
      f.phone.trim() &&
      f.email.trim() &&
      f.password
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isFormComplete()) {
      await showWarning('Completa todos los campos obligatorios antes de registrar.', 'Formulario incompleto')
      return
    }
    if (loading) {
      await showWarning('Espera a que termine la carga de datos e inténtalo de nuevo.', 'Cargando')
      return
    }

    const emailTrim = form.email.trim()
    const existeCorreo = usuarios.some((u) => (u.email ?? '').trim() === emailTrim)
    if (existeCorreo) {
      await showError('Ya existe un usuario con ese correo electrónico.', 'No se pudo registrar')
      return
    }

    const esPrimerUsuario = usuarios.length === 0
    const rolNombre = esPrimerUsuario ? 'ADMIN' : 'USUARIO'
    let rolId = idRolPorNombre(roles, rolNombre)
    if (rolId == null) {
      const rolesActualizados = await crearRolesBasicosSiFaltan()
      rolId = idRolPorNombre(rolesActualizados, rolNombre)
    }
    if (rolId == null) {
      const rolesRefrescados = await refrescarRoles()
      rolId = idRolPorNombre(rolesRefrescados, rolNombre)
    }
    if (rolId == null && DEFAULT_ROLE_IDS[rolNombre] != null) {
      rolId = DEFAULT_ROLE_IDS[rolNombre]
      await showWarning(
        `No se encontró el rol «${rolNombre}» en la base de datos, pero se usará el identificador predeterminado ${rolId}. Si esta operación falla, verifica los datos de roles en el backend.`,
        'Rol predeterminado usado',
      )
    }
    if (rolId == null) {
      await showError(
        `No se encontró el rol «${rolNombre}» en la base de datos y no pudo crearse automáticamente. Contacta al administrador del sistema.`,
        'Roles no disponibles',
      )
      return
    }

    const perfilBody = {
      tipoDocumento: form.documentType,
      numeroDocumento: form.documentNumber.trim(),
      nombre: form.firstName.trim(),
      apellido: form.lastName.trim(),
      direccion: form.address.trim(),
      telefono: form.phone.trim(),
    }

    setSubmitting(true)
    try {
      const resPerfil = await fetch(end_points.perfiles, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfilBody),
      })
      let perfilData = {}
      try {
        perfilData = await resPerfil.json()
      } catch {
        perfilData = {}
      }
      if (!resPerfil.ok) {
        await notifyApiResult(resPerfil, perfilData)
        return
      }
      const perfilId = perfilData?.id
      if (typeof perfilId !== 'number') {
        await showError('La API no devolvió el identificador del perfil creado.', 'Error inesperado')
        return
      }

      const usuarioBody = {
        email: emailTrim,
        password: form.password,
        rolId,
        perfilId,
      }

      const resUsuario = await fetch(end_points.usuarios, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioBody),
      })
      let usuarioData = {}
      try {
        usuarioData = await resUsuario.json()
      } catch {
        usuarioData = {}
      }
      await notifyApiResult(resUsuario, usuarioData)
      if (resUsuario.ok) {
        setForm(emptyForm())
        navigate('/login')
      }
    } catch (error) {
      console.error(error)
      await showError(
        error instanceof Error ? error.message : 'No se pudo enviar el registro. Intenta más tarde.',
        'Error de red',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const titulo =
    usuarios.length === 0 || registroInicial ? 'Registro del administrador' : 'Registro de usuario'

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg border-bottom bg-light">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <img
              src={Logo}
              alt="Logo"
              width={70}
              height={50}
              className="d-inline-block align-text-top me-2"
            />
            <span className="navbar-brand mb-0 h1">Biblioteca Virtual</span>
          </div>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-secondary">
              Iniciar sesión
            </Link>
            <Link to="/" className="btn btn-secondary">
              Regresar
            </Link>
          </div>
        </div>
      </nav>

      <div id="bannerRegistro" className="flex-grow-1">
        <div className="container mt-4 mb-4">
          <div className="register-container card shadow-sm p-4 rounded mx-auto bg-white">
            <h2 className="text-center mb-4">{titulo}</h2>
            {usuarios.length === 0 && (
              <p className="text-muted small text-center mb-3">
                Eres el primer usuario del sistema: se te asignará el rol ADMIN.
              </p>
            )}
            {loading && <div className="text-muted small mb-3">Cargando datos…</div>}
            <form id="registroForm" onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="tipoDocumento" className="form-label">
                    Tipo de documento
                  </label>
                  <select
                    id="tipoDocumento"
                    className="form-select"
                    value={form.documentType}
                    onChange={setField('documentType')}
                    required
                  >
                    <option value="">Selecciona una opción</option>
                    <option value="CC">Cédula de ciudadanía</option>
                    <option value="TI">Tarjeta de identidad</option>
                    <option value="CE">Cédula de extranjería</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="numeroDocumento" className="form-label">
                    Número de documento
                  </label>
                  <input
                    id="numeroDocumento"
                    type="text"
                    className="form-control"
                    value={form.documentNumber}
                    onChange={setField('documentNumber')}
                    required
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="nombre" className="form-label">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    className="form-control"
                    value={form.firstName}
                    onChange={setField('firstName')}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="apellido" className="form-label">
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    type="text"
                    className="form-control"
                    value={form.lastName}
                    onChange={setField('lastName')}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="direccion" className="form-label">
                  Dirección
                </label>
                <input
                  id="direccion"
                  type="text"
                  className="form-control"
                  value={form.address}
                  onChange={setField('address')}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  className="form-control"
                  value={form.phone}
                  onChange={setField('phone')}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  autoComplete="email"
                  value={form.email}
                  onChange={setField('email')}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={setField('password')}
                  required
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-info" disabled={loading || submitting}>
                  {submitting ? 'Registrando…' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Register
