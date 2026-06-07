import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [btnState, setBtnState] = useState('idle');
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
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
      setTimeout(() => navigate('/'), 950);
    } catch (err) {
      setBtnState('idle');
      triggerShake();
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

          {/* Social */}
          <div className="auth-social-row">
            <button type="button" className="auth-social-btn">
              <svg width="15" height="15" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Google
            </button>
            <button type="button" className="auth-social-btn">
              <svg width="14" height="14" viewBox="0 0 814 1000">
                <path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.8 0 248.4 0 128.2 0 57.7 22.6 0 66.6 0c0 0 0 0 .6 0C97.4 0 193.5 68.3 262.6 68.3c58.2 0 172.3-72.1 249.4-72.1 32.7 0 130.3 12.2 198.3 82.9zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
              </svg>
              Apple
            </button>
          </div>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">o continúa con tu correo</span>
            <div className="auth-divider-line" />
          </div>

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
