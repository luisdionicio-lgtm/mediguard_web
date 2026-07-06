import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';
import AuthBackground from '../components/AuthBackground';
import PhoneInput from '../components/PhoneInput';

const GOOGLE_ENABLED = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

/* ── Iconos sociales ── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden="true">
    <rect x="1"  y="1"  width="10" height="10" fill="#f25022" />
    <rect x="12" y="1"  width="10" height="10" fill="#7fba00" />
    <rect x="1"  y="12" width="10" height="10" fill="#00a4ef" />
    <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
  </svg>
);

/* ── Password strength ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: 'Débil',      color: 'var(--error)' },
    { label: 'Débil',      color: 'var(--error)' },
    { label: 'Regular',    color: 'var(--warning)' },
    { label: 'Fuerte',     color: 'var(--brand)' },
    { label: 'Muy fuerte', color: 'var(--brand)' },
  ];
  return { score: s, ...map[s] };
}

function barClass(i, score) {
  if (!score) return '';
  if (score === 1 && i === 0)  return 'weak';
  if (score === 2 && i <= 1)   return 'regular';
  if (score === 3 && i <= 2)   return 'strong';
  if (score === 4)              return 'vstrong';
  return '';
}

const USER_TYPES = [
  { value: 'PACIENTE', label: 'Paciente', icon: 'ti-heart',           desc: 'Quiero cuidar mi salud y la de los míos' },
  { value: 'MEDICO',   label: 'Médico',   icon: 'ti-stethoscope',     desc: 'Brindo atención médica profesional' },
  { value: 'CUIDADOR', label: 'Cuidador', icon: 'ti-heart-handshake', desc: 'Acompaño y apoyo a otra persona' },
];

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep]         = useState(1);
  const [form, setForm]         = useState({ name: '', email: '', password: '', phone: '', userType: 'PACIENTE' });
  const [showPw, setShowPw]     = useState(false);
  const [btnState, setBtnState] = useState('idle');
  const [error, setError]       = useState('');
  const [fieldErr, setFieldErr] = useState('');
  const [shaking, setShaking]   = useState(false);
  const [googleErr, setGoogleErr]       = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const btnRef = useRef(null);

  const emailValid     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const phoneValid     = /^[+]?[\d\s-]{6,15}$/.test(form.phone.trim());
  const canSubmitStep1 = form.name.trim().length > 1 && emailValid && form.password.length >= 6;
  const canSubmitStep2 = phoneValid && !!form.userType;
  const strength   = getStrength(form.password);
  const firstName  = form.name.trim().split(' ')[0] || '';
  const busy       = btnState === 'loading' || btnState === 'success';

  const onChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError(''); setFieldErr('');
  };

  const triggerRipple = e => {
    const btn = btnRef.current;
    if (!btn) return;
    const d    = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    const el   = document.createElement('span');
    el.className = 'auth-ripple';
    el.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px;`;
    btn.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  };

  /* ── Google OAuth ── */
  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleErr('');
        const data = await authService.googleLogin(tokenResponse.access_token);
        setBtnState('success');
        const dest = Array.isArray(data?.user?.roles) && data.user.roles.includes('ADMIN')
          ? '/admin/dashboard' : '/dashboard';
        setTimeout(() => navigate(dest), 900);
      } catch (err) {
        setGoogleErr(err?.response?.data?.error || 'Error al autenticar con Google.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (err) => {
      setGoogleLoading(false);
      setGoogleErr(err?.error_description || 'No se pudo conectar con Google.');
    },
    onNonOAuthError: () => setGoogleLoading(false),
  });

  const handleGoogleClick = () => {
    if (busy || googleLoading) return;
    setGoogleLoading(true);
    setGoogleErr('');
    googleLogin();
  };

  const goToStep2 = e => {
    e.preventDefault();
    if (!canSubmitStep1) return;
    setError(''); setFieldErr('');
    setStep(2);
  };

  const backToStep1 = () => {
    setStep(1);
    setError(''); setFieldErr('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!canSubmitStep2) return;
    setError(''); setFieldErr('');
    triggerRipple(e);
    setBtnState('loading');

    const parts      = form.name.trim().split(' ');
    const first_name = parts[0];
    const last_name  = parts.slice(1).join(' ') || first_name;

    try {
      await authService.register({
        first_name,
        last_name,
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        user_type: form.userType,
      });
      setBtnState('success');
      setTimeout(() => navigate('/dashboard'), 1100);
    } catch (err) {
      setBtnState('idle');
      setShaking(true);
      setTimeout(() => setShaking(false), 380);
      const errors = err.response?.data?.errors || {};
      if (errors.email?.length) {
        setStep(1); setFieldErr(errors.email[0]);
      } else if (errors.password?.length) {
        setStep(1); setFieldErr(errors.password[0]);
      } else if (errors.phone?.length) {
        setFieldErr(errors.phone[0]);
      } else if (!err.response) {
        setError('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
      } else {
        setError(getApiErrorMessage(err, 'Error al registrar la cuenta.'));
      }
    }
  };

  return (
    <div className="auth-page">
      <AuthBackground />
      <div className="auth-wrapper">

        {/* ══ PANEL IZQUIERDO — misma foto que Login ══ */}
        <div className="auth-brand">

          <img
            src="https://images.unsplash.com/photo-1666887360388-93e684b6474a?w=700&h=1000&fit=crop&auto=format&crop=top"
            alt="Profesional médico con estetoscopio"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />

          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,22,14,0.98) 0%, rgba(8,22,14,0.88) 28%, rgba(8,22,14,0.35) 58%, rgba(8,22,14,0.08) 100%)' }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Logo */}
            <div className="auth-brand-logo">
              <div className="auth-brand-logo-dot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="3,12 6,7 9,14 12,4 15,14 18,9 21,12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="auth-brand-logo-name">Medi<em>Guard</em> AI</span>
            </div>

            <div style={{ flex: 1 }} />

            {/* Base: badge + headline + SSL */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(92,184,154,0.12)', border: '1px solid rgba(92,184,154,0.25)', borderRadius: 20, padding: '4px 12px', marginBottom: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5CB89A', flexShrink: 0 }} />
                <span style={{ color: '#5CB89A', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Salud de Emergencia · IA</span>
              </div>

              <p className="auth-brand-headline" style={{ fontSize: '1.45rem', lineHeight: 1.3 }}>
                Tu salud<br />siempre<br /><em>protegida.</em>
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 14 }}>
                {[
                  { icon: 'ti ti-lock',  label: 'SSL 256-bit' },
                  { icon: 'ti ti-award', label: 'ISO 27001' },
                  { icon: 'ti ti-clock', label: '24/7' },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <i className={b.icon} style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.63rem', fontWeight: 600 }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══ PANEL DERECHO — formulario ══ */}
        <div className={`auth-form-panel${shaking ? ' shake' : ''}`}>
          <div className="auth-form-card">

            {step === 1 && (
              <div className="auth-tabs">
                <Link to="/login" className="auth-tab" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                  Iniciar sesión
                </Link>
                <button className="auth-tab active" type="button">Crear cuenta</button>
              </div>
            )}

            {/* Indicador de pasos */}
            <div className="auth-steps">
              <span className={`auth-step-dot${step >= 1 ? ' active' : ''}`}>
                {step > 1 ? <i className="ti ti-check" style={{ fontSize: 13 }} /> : '1'}
              </span>
              <span className={`auth-step-line${step > 1 ? ' done' : ''}`} />
              <span className={`auth-step-dot${step >= 2 ? ' active' : ''}`}>2</span>
              <span className="auth-step-label">Paso {step} de 2</span>
            </div>

            {error && (
              <div className="auth-error-banner">
                <i className="ti ti-x" style={{ fontSize: 14 }} />{error}
              </div>
            )}

            {step === 1 ? (
              <>
                <h1 className="auth-form-title">Empieza gratis hoy</h1>
                <p className="auth-form-sub">Sin tarjeta de crédito · listo en 60 segundos</p>

                <form onSubmit={goToStep2} noValidate>
                  <div className="auth-field">
                    <label className="auth-label">Nombre completo</label>
                    <div className="auth-input-wrap">
                      <i className="ti ti-user auth-input-icon" />
                      <input
                        className="auth-input"
                        type="text"
                        name="name"
                        placeholder="Ana García"
                        autoComplete="name"
                        value={form.name}
                        onChange={onChange}
                      />
                    </div>
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Correo electrónico</label>
                    <div className="auth-input-wrap">
                      <i className="ti ti-mail auth-input-icon" />
                      <input
                        className={`auth-input${fieldErr && fieldErr.includes('correo') ? ' is-error' : ''}`}
                        type="email"
                        name="email"
                        placeholder="ana@correo.com"
                        autoComplete="email"
                        value={form.email}
                        onChange={onChange}
                      />
                    </div>
                    {fieldErr && fieldErr.includes('correo') && (
                      <span className="auth-field-error show">{fieldErr}</span>
                    )}
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Contraseña</label>
                    <div className="auth-input-wrap">
                      <i className="ti ti-lock auth-input-icon" />
                      <input
                        className={`auth-input${fieldErr && fieldErr.includes('contraseña') ? ' is-error' : ''}`}
                        type={showPw ? 'text' : 'password'}
                        name="password"
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={onChange}
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
                    {form.password.length > 0 && (
                      <>
                        <div className="auth-pw-bars">
                          {[0, 1, 2, 3].map(i => (
                            <div key={i} className={`auth-pw-bar ${barClass(i, strength.score)}`} />
                          ))}
                        </div>
                        <span className="auth-pw-label" style={{ color: strength.color }}>{strength.label}</span>
                      </>
                    )}
                    {fieldErr && fieldErr.includes('contraseña') && (
                      <span className="auth-field-error show">{fieldErr}</span>
                    )}
                  </div>

                  <button type="submit" className="auth-submit" disabled={!canSubmitStep1}>
                    Continuar <i className="ti ti-arrow-right" style={{ fontSize: 15 }} />
                  </button>
                </form>
              </>
            ) : (
              <>
                <button type="button" className="auth-back-link" onClick={backToStep1}>
                  <i className="ti ti-arrow-left" /> Atrás
                </button>

                <h1 className="auth-form-title">{firstName ? `¡Hola, ${firstName}!` : '¡Ya casi terminamos!'}</h1>
                <p className="auth-form-sub">Cuéntanos un poco más para personalizar tu cuenta</p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="auth-field">
                    <label className="auth-label">Teléfono</label>
                    <PhoneInput
                      value={form.phone}
                      hasError={!!(fieldErr && fieldErr.includes('teléfono'))}
                      onChange={val => { setForm(f => ({ ...f, phone: val })); setFieldErr(''); }}
                    />
                    <span className="auth-form-hint">Lo usaremos para alertar a tus contactos en una emergencia.</span>
                    {fieldErr && fieldErr.includes('teléfono') && (
                      <span className="auth-field-error show">{fieldErr}</span>
                    )}
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">¿Cómo usarás MediGuard?</label>
                    <div className="auth-usertype-grid">
                      {USER_TYPES.map(t => (
                        <button
                          key={t.value}
                          type="button"
                          className={`auth-usertype-card${form.userType === t.value ? ' active' : ''}`}
                          onClick={() => setForm(f => ({ ...f, userType: t.value }))}
                          title={t.desc}
                        >
                          <i className={`ti ${t.icon}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    ref={btnRef}
                    type="submit"
                    className={`auth-submit${btnState === 'success' ? ' is-success' : ''}`}
                    disabled={!canSubmitStep2 || busy}
                  >
                    {btnState === 'loading' && <><span className="auth-spinner" />Creando cuenta…</>}
                    {btnState === 'success' && <><i className="ti ti-circle-check" style={{ fontSize: 17 }} />¡Cuenta creada!</>}
                    {btnState === 'idle'    && <>Crear mi cuenta gratis <i className="ti ti-arrow-right" style={{ fontSize: 15 }} /></>}
                  </button>
                </form>
              </>
            )}

            <div className="auth-trust">
              <span className="auth-trust-item"><i className="ti ti-shield" />Encriptado</span>
              <span className="auth-trust-item"><i className="ti ti-circle-check" />Gratis siempre</span>
              <span className="auth-trust-item"><i className="ti ti-ban" />Sin spam</span>
              <span className="auth-trust-item"><i className="ti ti-ban" />Sin tarjeta</span>
            </div>

            <p className="auth-switch">
              ¿Ya tienes cuenta?&nbsp;<Link to="/login">Inicia sesión aquí</Link>
            </p>

            {/* Acceso rápido */}
            <div className="auth-divider" style={{ margin: '16px 0 14px' }}>
              <div className="auth-divider-line" />
              <span className="auth-divider-text">o acceso rápido con</span>
              <div className="auth-divider-line" />
            </div>

            <div className="auth-social-row">
              <button
                type="button"
                className="auth-social-btn"
                onClick={handleGoogleClick}
                disabled={!GOOGLE_ENABLED || busy || googleLoading}
                title={GOOGLE_ENABLED ? 'Continuar con Gmail' : 'Google no configurado'}
              >
                {googleLoading
                  ? <span className="auth-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                  : <GoogleIcon />}
                <span className="social-label">Gmail</span>
              </button>

              <button type="button" className="auth-social-btn" disabled title="Próximamente">
                <AppleIcon />
                <span className="social-label">iOS</span>
              </button>

              <button type="button" className="auth-social-btn" disabled title="Próximamente">
                <MicrosoftIcon />
                <span className="social-label">Microsoft</span>
              </button>
            </div>

            {googleErr && (
              <p className="auth-field-error show" style={{ marginTop: 6, textAlign: 'center' }}>{googleErr}</p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
