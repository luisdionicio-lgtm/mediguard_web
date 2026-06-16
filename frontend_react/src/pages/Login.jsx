import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';
import GoogleLoginButton from '../components/GoogleLoginButton';
import AuthBackground from '../components/AuthBackground';
import AuthStats from '../components/AuthStats';

const GOOGLE_ENABLED = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

function FirstAidScene() {
  return (
    <svg
      width="210" height="218"
      viewBox="0 0 210 218"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', margin: '0 auto' }}
    >
      {/* ── Fondo circular ── */}
      <circle cx="105" cy="104" r="88" fill="rgba(255,255,255,0.03)" />

      {/* ── Botiquín (base de la escena) ── */}
      {/* Cuerpo del maletín */}
      <rect x="58" y="72" width="94" height="72" rx="10" fill="#DC2626" />
      <rect x="58" y="72" width="94" height="72" rx="10" stroke="#991B1B" strokeWidth="2" />
      {/* Tapa superior más clara */}
      <rect x="58" y="72" width="94" height="34" rx="10" fill="#EF4444" />
      <rect x="58" y="96" width="94" height="10" fill="#DC2626" />
      {/* Asa */}
      <path d="M84 72 Q84 58 105 58 Q126 58 126 72" stroke="#B91C1C" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Broche central */}
      <rect x="97" y="99" width="16" height="10" rx="3" fill="#991B1B" />
      <rect x="100" y="101" width="10" height="6" rx="2" fill="#FCA5A5" />

      {/* ── Cruz blanca sobre el botiquín ── */}
      <rect x="98" y="78" width="14" height="34" rx="4" fill="#fff" opacity="0.95" />
      <rect x="84" y="88" width="42" height="14" rx="4" fill="#fff" opacity="0.95" />

      {/* ── Corazón pulsante encima ── */}
      <g transform="translate(105,50)">
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1 1;1.13 1.13;1 1;1.07 1.07;1 1"
          dur="1.1s"
          repeatCount="indefinite"
          additive="sum"
          calcMode="spline"
          keyTimes="0;0.25;0.45;0.65;1"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
        />
        <path
          d="M0 6 C0 0 -8 -5 -13 -1 C-18 3 -13 11 0 20 C13 11 18 3 13 -1 C8 -5 0 0 0 6Z"
          fill="#EF4444"
        />
        {/* Brillo del corazón */}
        <path
          d="M-9 1 C-10 -1 -8 -3 -6 -2"
          stroke="#FCA5A5" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8"
        />
      </g>

      {/* ── Señal de alerta (triángulo) — esquina superior derecha ── */}
      <g>
        <polygon points="165,28 178,52 152,52" fill="#F59E0B" opacity="0.9" />
        <rect x="169.5" y="34" width="3" height="10" rx="1.5" fill="#fff" />
        <circle cx="171" cy="48" r="1.8" fill="#fff" />
        {/* Parpadeo */}
        <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.6s" repeatCount="indefinite" />
      </g>

      {/* ── Sirena / luces de defensa civil (esquina superior izq.) ── */}
      <g transform="translate(36,36)">
        {/* Cuerpo sirena */}
        <rect x="-12" y="-8" width="24" height="16" rx="8" fill="#1D4ED8" />
        {/* Luz izquierda roja */}
        <circle cx="-6" cy="0" r="5" fill="#EF4444">
          <animate attributeName="opacity" values="1;0.2;1" dur="0.7s" repeatCount="indefinite" />
        </circle>
        {/* Luz derecha azul */}
        <circle cx="6" cy="0" r="5" fill="#3B82F6">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="0.7s" repeatCount="indefinite" />
        </circle>
        {/* Destello irradiado rojo */}
        <circle cx="-6" cy="0" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0">
          <animate attributeName="r"       values="5;16;5"    dur="0.7s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="0.7s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ── ECG / pulso cardíaco en la base ── */}
      <polyline
        points="10,168 30,168 38,150 46,185 54,138 62,168 82,168 90,158 98,177 106,168 192,168"
        stroke="#4ADE80"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.85"
      >
        <animate
          attributeName="stroke-dasharray"
          from="0 400"
          to="400 0"
          dur="2s"
          repeatCount="indefinite"
        />
      </polyline>
      {/* Punto ECG pulsante */}
      <circle cx="192" cy="168" r="4" fill="#4ADE80">
        <animate attributeName="opacity" values="1;0.1;1" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="r"       values="4;7;4"   dur="1.1s" repeatCount="indefinite" />
      </circle>
      {/* Línea base ECG */}
      <line x1="10" y1="168" x2="192" y2="168" stroke="rgba(74,222,128,0.12)" strokeWidth="1" />

      {/* ── Etiqueta EMERGENCIA ── */}
      <rect x="52" y="152" width="106" height="18" rx="5" fill="rgba(220,38,38,0.15)" />
      <text
        x="105" y="164"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        fill="#EF4444"
        letterSpacing="1.5"
      >EMERGENCIA MÉDICA</text>

      {/* ── Partículas / destellos verdes ── */}
      {[[22,90],[188,82],[170,132],[24,128]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#4ADE80" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.05;0.5" dur={`${1.5 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.38}s`} />
          <animate attributeName="r"       values="3;5;3"         dur={`${1.5 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.38}s`} />
        </circle>
      ))}

      {/* ── Anillo de alerta exterior ── */}
      <circle cx="105" cy="104" r="94" stroke="#EF4444" strokeWidth="1" opacity="0.12">
        <animate attributeName="r"       values="94;98;94"    dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.03;0.12" dur="2.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ── LÓGICA INTACTA ── */
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
      <AuthBackground />
      <div className="auth-wrapper">

        {/* ══ COLUMNA IZQUIERDA ══ */}
        <div className="auth-brand">
          {/* Logo */}
          <div className="auth-brand-logo">
            <div className="auth-brand-logo-dot">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="3,12 6,7 9,14 12,4 15,14 18,9 21,12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="auth-brand-logo-name">Medi<em>Guard</em> AI</span>
          </div>

          <p className="auth-brand-headline">Tu salud, siempre<br /><em>protegida.</em></p>

          {/* Ilustración animada */}
          <div style={{ margin: '18px 0 14px' }}>
            <FirstAidScene />
          </div>

          <p className="auth-brand-sub">Accede a tu perfil médico seguro y a todas las herramientas de MediGuard.</p>

          <div className="auth-brand-divider" />

          <div className="auth-brand-bullets">
            {[
              { icon: 'ti ti-shield-lock',   label: 'Sesión encriptada',  desc: 'TLS de extremo a extremo en cada acceso' },
              { icon: 'ti ti-device-mobile', label: 'Multiplataforma',    desc: 'Web y app móvil sincronizados en tiempo real' },
              { icon: 'ti ti-clock',         label: 'Disponible 24/7',    desc: 'Tus registros siempre accesibles' },
            ].map(b => (
              <div key={b.label} className="auth-brand-bullet">
                <div className="auth-brand-bullet-icon"><i className={b.icon} /></div>
                <div>
                  <p className="auth-brand-bullet-label">{b.label}</p>
                  <p className="auth-brand-bullet-desc">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="auth-brand-footer">
            <p className="auth-brand-tagline">MediGuard AI · TECSUP 2026</p>
          </div>
        </div>

        {/* ══ COLUMNA DERECHA ══ */}
        <div ref={panelRef} className={`auth-form-panel${shaking ? ' shake' : ''}`}>
          <div className="auth-form-card">

            {/* Tabs */}
            <div className="auth-tabs">
              <button className="auth-tab active" type="button">Iniciar sesión</button>
              <Link to="/register" className="auth-tab" style={{ textDecoration: 'none' }}>
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

            {/* Google OAuth */}
            {GOOGLE_ENABLED && (
              <GoogleLoginButton
                onSuccess={async (accessToken) => {
                  setGoogleErr('');
                  setBtnState('loading');
                  try {
                    const data = await authService.googleLogin(accessToken);
                    const user = data.user;
                    setBtnState('success');
                    const destination = Array.isArray(user?.roles) && user.roles.includes('ADMIN')
                      ? '/admin/dashboard' : '/dashboard';
                    setTimeout(() => navigate(destination), 900);
                  } catch (err) {
                    setBtnState('idle');
                    const msg = err?.response?.data?.error || 'Error al autenticar con Google.';
                    setGoogleErr(msg);
                  }
                }}
                onError={(msg) => { setGoogleErr(msg || 'No se pudo conectar con Google.'); setBtnState('idle'); }}
                disabled={btnState === 'loading' || btnState === 'success'}
              />
            )}
            {GOOGLE_ENABLED && googleErr && (
              <p className="auth-field-error show" style={{ marginTop: '-8px', marginBottom: '12px' }}>{googleErr}</p>
            )}
            {GOOGLE_ENABLED && <div className="google-divider">o continúa con tu correo</div>}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
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
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPw(p => !p)} tabIndex={-1} aria-label={showPw ? 'Ocultar' : 'Mostrar'}>
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
                {btnState === 'loading' && <><span className="auth-spinner" />Ingresando…</>}
                {btnState === 'success' && <><i className="ti ti-circle-check" style={{ fontSize: 17 }} />¡Acceso concedido!</>}
                {btnState === 'idle'    && <>Ingresar a mi cuenta →</>}
              </button>
            </form>

            {/* Trust badges */}
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

      </div>
    </div>
  );
}
