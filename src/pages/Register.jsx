import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ApiAutenticacion } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // MOCK BACKEND
      // const response = await ApiAutenticacion.register(userData);
      
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/login');
    } catch (error) {
       Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: error.message || 'No se pudo crear la cuenta',
       });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Crear Cuenta</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input 
              type="text" 
              className="form-control" 
              name="nombre" 
              value={userData.nombre} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              name="email" 
              value={userData.email} 
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
              value={userData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <span>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></span>
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

export default Register;
