import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';
import GoogleLoginButton from '../components/GoogleLoginButton';

const GOOGLE_ENABLED = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [btnState, setBtnState] = useState('idle');
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [googleErr, setGoogleErr] = useState('');
  const [shaking, setShaking] = useState(false);
  const [successMsg] = useState(location.state?.successMessage || '');

  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = emailValid && password.length >= 4;

  const triggerRipple = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'auth-ripple';
    el.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px;`;
    btn.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 380);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setEmailErr(''); setPwErr('');
    triggerRipple(e);
    setBtnState('loading');

    try {
      await authService.login(email.trim(), password);
      setBtnState('success');
      const destination = authService.isAdmin() ? '/admin/dashboard' : '/dashboard';
      setTimeout(() => navigate(destination), 950);
    } catch (err) {
      setBtnState('idle');
      triggerShake();
      if (!err.response) {
        setPwErr('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
        return;
      }
      const msg = getApiErrorMessage(err, 'Credenciales incorrectas.');
      if (msg.toLowerCase().includes('correo') || msg.toLowerCase().includes('usuario')) {
        setEmailErr(msg);
      } else {
        setPwErr('Contraseña incorrecta. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-pattern" aria-hidden="true" />
      <div className="auth-wrapper">

        {/* ── Left brand panel ── */}
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <div className="auth-brand-logo-dot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="auth-brand-logo-name">MediGuard AI</span>
          </div>

          <p className="auth-brand-headline">Tu historial, tus alertas,<br />siempre contigo</p>
          <p className="auth-brand-sub">Accede a tu perfil médico seguro y a todas las herramientas de MediGuard.</p>

          <div className="auth-brand-divider" />

          <div className="auth-brand-bullets">
            <div className="auth-brand-bullet">
              <div className="auth-brand-bullet-icon"><i className="ti ti-shield-check" /></div>
              <div>
                <p className="auth-brand-bullet-label">Sesión encriptada</p>
                <p className="auth-brand-bullet-desc">TLS de extremo a extremo en cada acceso</p>
              </div>
            </div>
            <div className="auth-brand-bullet">
              <div className="auth-brand-bullet-icon"><i className="ti ti-device-mobile" /></div>
              <div>
                <p className="auth-brand-bullet-label">Acceso multiplataforma</p>
                <p className="auth-brand-bullet-desc">Web y app móvil sincronizados en tiempo real</p>
              </div>
            </div>
            <div className="auth-brand-bullet">
              <div className="auth-brand-bullet-icon"><i className="ti ti-clock" /></div>
              <div>
                <p className="auth-brand-bullet-label">Historial disponible 24/7</p>
                <p className="auth-brand-bullet-desc">Tus registros médicos siempre accesibles</p>
              </div>
            </div>
          </div>

          <div className="auth-brand-footer">
            <p className="auth-brand-tagline">Plataforma médica inteligente</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div ref={panelRef} className={`auth-form-panel${shaking ? ' shake' : ''}`}>
          {/* Tabs */}
          <div className="auth-tabs">
            <button className="auth-tab active" type="button">Iniciar sesión</button>
            <Link to="/register" className="auth-tab" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              Crear cuenta
            </Link>
          </div>

          <h1 className="auth-form-title">Accede a tu cuenta</h1>
          <p className="auth-form-sub">Ingresa tus credenciales para continuar</p>

          {successMsg && (
            <div className="auth-success-banner">
              <i className="ti ti-circle-check" style={{ fontSize: 15 }} />
              {successMsg}
            </div>
          )}

          {/* Google OAuth — solo si VITE_GOOGLE_CLIENT_ID está configurado */}
          {GOOGLE_ENABLED && <GoogleLoginButton
            onSuccess={async (accessToken) => {
              setGoogleErr('');
              setBtnState('loading');
              try {
                const data = await authService.googleLogin(accessToken);
                const user = data.user;
                setBtnState('success');
                const destination = Array.isArray(user?.roles) && user.roles.includes('ADMIN')
                  ? '/admin/dashboard'
                  : '/dashboard';
                setTimeout(() => navigate(destination), 900);
              } catch (err) {
                setBtnState('idle');
                const msg = err?.response?.data?.error || 'Error al autenticar con Google.';
                setGoogleErr(msg);
              }
            }}
            onError={(msg) => {
              setGoogleErr(msg || 'No se pudo conectar con Google.');
              setBtnState('idle');
            }}
            disabled={btnState === 'loading' || btnState === 'success'}
          />}

          {GOOGLE_ENABLED && googleErr && (
            <p className="auth-field-error show" style={{ marginTop: '-8px', marginBottom: '12px' }}>
              {googleErr}
            </p>
          )}

          {GOOGLE_ENABLED && <div className="google-divider">o continúa con tu correo</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email : API -> credentials */}
            <div className="auth-field">
              <label className="auth-label">Correo electrónico</label>
              <div className="auth-input-wrap">
                <i className="ti ti-mail auth-input-icon" />
                <input
                  className={`auth-input${emailErr ? ' is-error' : ''}${btnState === 'success' ? ' is-success' : ''}`}
                  type="email"
                  placeholder="ana@correo.com"
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                />
              </div>
              <span className={`auth-field-error${emailErr ? ' show' : ''}`}>{emailErr}</span>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Contraseña</label>
              <div className="auth-input-wrap">
                <i className="ti ti-lock auth-input-icon" />
                <input
                  className={`auth-input${pwErr ? ' is-error' : ''}${btnState === 'success' ? ' is-success' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPwErr(''); }}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPw(p => !p)}
                  tabIndex={-1}
                  aria-label={showPw ? 'Ocultar' : 'Mostrar'}
                >
                  <i className={showPw ? 'ti ti-eye-off' : 'ti ti-eye'} />
                </button>
              </div>
              <span className={`auth-field-error${pwErr ? ' show' : ''}`}>{pwErr}</span>
            </div>

            <span className="auth-forgot">¿Olvidaste tu contraseña?</span>

            <button
              ref={btnRef}
              type="submit"
              className={`auth-submit${btnState === 'success' ? ' is-success' : ''}`}
              disabled={!canSubmit || btnState === 'loading' || btnState === 'success'}
            >
              {btnState === 'loading' && <><span className="auth-spinner" />Verificando…</>}
              {btnState === 'success' && <><i className="ti ti-circle-check" style={{ fontSize: 17 }} />¡Acceso concedido!</>}
              {btnState === 'idle' && <>Ingresar a mi cuenta <i className="ti ti-arrow-right" style={{ fontSize: 15 }} /></>}
            </button>
          </form>

          <div className="auth-trust">
            <span className="auth-trust-item"><i className="ti ti-lock" />Sesión segura</span>
            <span className="auth-trust-item"><i className="ti ti-shield" />Datos encriptados</span>
            <span className="auth-trust-item"><i className="ti ti-eye-off" />Privacidad total</span>
          </div>

          <p className="auth-switch">
            ¿No tienes cuenta?&nbsp;<Link to="/register">Regístrate gratis</Link>
          </p>
        </div>

      </div>

      <footer className="auth-micro-footer">
        <span>© {new Date().getFullYear()} MediGuard AI</span>
        <span className="auth-micro-footer-dot" />
        <Link to="/#about">El proyecto</Link>
        <span className="auth-micro-footer-dot" />
        <span>Proyecto Integrador · TECSUP 2026</span>
      </footer>
    </div>
  );
}
