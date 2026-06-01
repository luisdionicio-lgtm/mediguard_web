import { useState } from 'react';
import { Link, useNavigate, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';

function Login() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // POR QUÉ: estado booleano simple — no necesitamos nada más complejo que true/false
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim()) {
      setError('El correo electrónico es obligatorio.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
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
      {/* POR QUÉ animate-fade-in: la tarjeta aparece suavemente al montar el componente,
          reduce el "pop" brusco que desorenta al usuario */}
      <div className="auth-card animate-fade-in">
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

          {/* POR QUÉ noValidate: desactivamos la validación nativa del browser para
              controlar nosotros el feedback visual (más consistente con el diseño) */}
          <form onSubmit={handleLogin} noValidate>

            {/* POR QUÉ role="alert": cuando el error aparece, los lectores de pantalla
                (NVDA, VoiceOver) lo anuncian automáticamente sin que el usuario
                navegue hacia él. Sin esto, un usuario ciego nunca sabrá que falló. */}
            {error && (
              <div className="error-message" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
            )}

            <div className="form-group">
              {/* POR QUÉ htmlFor + id: el label queda semánticamente ligado al input.
                  Beneficios: 1) click en el label hace focus al input,
                  2) los lectores de pantalla anuncian el label al enfocar el input */}
              <label className="form-label" htmlFor="login-email">
                Correo Electrónico
              </label>
              <div className="form-input-container">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Contraseña
              </label>
              <div className="form-input-container">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                {/* POR QUÉ type dinámico: cambia entre "password" (oculto) y "text" (visible).
                    Es el patrón estándar — no hay magia, solo un ternario en el atributo type */}
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input form-input--has-toggle"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />
                {/* POR QUÉ type="button": sin esto, cualquier click en este botón
                    dentro del <form> dispararía el onSubmit. type="button" lo previene. */}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    // Ojo tachado = contraseña visible (el ojo ve, pero está "bloqueado")
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    // Ojo abierto = contraseña oculta (puedes hacer click para verla)
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* POR QUÉ spinner en lugar de solo texto: el texto "Cargando..." no cambia
                visualmente — el ojo humano ignora texto estático. Un elemento en movimiento
                (spinner) activa el sistema visual periférico y comunica actividad de forma
                inequívoca. Principio UX: feedback debe ser perceptible sin leer. */}
            <button
              type="submit"
              className="btn btn-primary btn--full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  Verificando...
                </>
              ) : (
                'Ingresar a mi cuenta'
              )}
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
