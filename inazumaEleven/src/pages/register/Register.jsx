import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import './Register.css';

export default function Register() {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [estado, setEstado] = useState({
    mensaje: '',
    esExito: false,
    cargando: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado({ ...estado, cargando: true });

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setEstado({
          mensaje:'Usuario registrado correctamente',
          esExito: true,
          cargando: false
        });

        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        setTimeout(() => {
          setEstado({ mensaje: '', esExito: false, cargando: false });
          navigate('/login');
        }, 1000);

      } else {
        setEstado({
          mensaje:'Error al registrar usuario',
          esExito: false,
          cargando: false
        });
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setEstado({
        mensaje: 'Error de conexión con el servidor',
        esExito: false,
        cargando: false
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-card">
        

          {estado.mensaje && (
            <div className={estado.esExito ? 'register-success' : 'register-error'}>
              {estado.mensaje}
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-input-group">
              <label className="register-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="register-input"
                placeholder="usuario"
                autoComplete="username"
                disabled={estado.cargando}
                required
              />
            </div>

            <div className="register-input-group">
              <label className="register-label" htmlFor="email">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="register-input"
                placeholder="tu@email.com"
                autoComplete="email"
                disabled={estado.cargando}
                required
              />
            </div>

            <div className="register-input-group">
              <label className="register-label" htmlFor="password">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="register-input"
                placeholder="••••••••"
                disabled={estado.cargando}
                required
              />
            </div>

            <div className="register-input-group">
              <label className="register-label" htmlFor="confirmPassword">
                Confirmar Contraseña
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-input"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={estado.cargando}
                required
              />
            </div>

            <button 
              type="submit" 
              className="register-button"
              disabled={estado.cargando}
            >
              {estado.cargando ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="register-footer">
            ¿Ya tienes cuenta?{' '}
            <Link to={'/login'} className="register-link">
              <span>Inicia sesión</span>
            </Link>
          </p>
        </div>
      </div>

      <div className="register-right">
        
      </div>
    </div>
  );
}