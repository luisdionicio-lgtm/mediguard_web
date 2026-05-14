import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Credenciales incorrectas o error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="auth-visual-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h2>Bienvenido de nuevo</h2>
          <p>
            Accede a tu panel de control de MediGuard AI. Tu red de seguridad e historial médico en un solo lugar seguro.
          </p>
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <h3>Iniciar Sesión</h3>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="error-message" style={{color: '#EF4444', marginBottom: '1rem'}}>{error}</div>}
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <div className="form-input-container">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Cargando...' : 'Ingresar a mi cuenta'}
            </button>
          </form>

          <div className="auth-links">
            ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
