import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ApiAutenticacion } from '../services/api';
import { saveAuthData } from '../helpers/auth';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // HU07: Llamada la abstracción de red
      // MOCK: Aquí puedes reemplazar por la llamada real al backend
      // const response = await ApiAutenticacion.login(credentials);
      
      // Simulación de éxito (ya que el backend es propio y quizás no esté listo)
      if (credentials.email === 'admin@admin.com') {
        saveAuthData('fake-token-12345', { nombre: 'Super Admin', rol: 'ADMIN' });
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Has iniciado sesión correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/admin/libros');
      } else {
        throw new Error('Credenciales inválidas (intenta con admin@admin.com)');
      }
    } catch (error) {
       Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: error.message || 'Usuario o contraseña incorrectos',
       });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              name="email" 
              value={credentials.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              name="password" 
              value={credentials.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Accediendo...' : 'Ingresar'}
          </button>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <span>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6f8'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  }
};

export default Login;
