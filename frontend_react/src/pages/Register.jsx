import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor, verifica e inténtalo de nuevo.');
      return;
    }

    const nameParts = form.name.split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || ' ';

    setLoading(true);
    try {
      await authService.register({
        first_name,
        last_name,
        email: form.email,
        password: form.password
      });
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.email ? 'El correo ya está registrado.' : 'Error al registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  // Basic password strength indicator
  const getPasswordStrength = () => {
    const len = form.password.length;
    if (len === 0) return { width: '0%', color: 'transparent' };
    if (len < 6) return { width: '33%', color: 'var(--red-emergency)' };
    if (len < 10) return { width: '66%', color: '#f59e0b' }; // yellow
    return { width: '100%', color: 'var(--teal-primary)' };
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="auth-visual-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <h2>Únete a MediGuard AI</h2>
          <p>
            Crea tu perfil médico seguro y obtén acceso a herramientas vitales de primeros auxilios y respuesta ante emergencias.
          </p>
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h3>Crear Cuenta</h3>
            <p>Comienza tu registro gratuito en segundos</p>
          </div>

          <form onSubmit={handleRegister}>
            {error && <div className="error-message" style={{color: '#EF4444', marginBottom: '1rem'}}>{error}</div>}
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <div className="form-input-container">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Juan Pérez"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <div className="form-input-container">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="form-input-container">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Crea una contraseña segura"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              {form.password.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--gray-200)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: getPasswordStrength().width, backgroundColor: getPasswordStrength().color, transition: 'all 0.3s' }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--blue-light)', marginTop: '0.25rem', display: 'block' }}>
                    Fuerza de la contraseña
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <div className="form-input-container">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
                </svg>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Repite tu contraseña"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Registrando...' : 'Completar Registro'}
            </button>
          </form>

          <div className="auth-links">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;