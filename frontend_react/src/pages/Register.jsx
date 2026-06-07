import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';

/* ── Password strength ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label:'Débil',      color:'#e24b4a' },
    { label:'Débil',      color:'#e24b4a' },
    { label:'Regular',    color:'#ef9f27' },
    { label:'Fuerte',     color:'var(--brand)' },
    { label:'Muy fuerte', color:'var(--brand)' },
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

/* ── Tipos de usuario (paso 2) ──
   El backend solo conoce los roles CIUDADANO/SOCORRISTA/COORDINADOR/ADMIN;
   estas etiquetas se traducen a esos roles en AuthService. */
const USER_TYPES = [
  { value: 'PACIENTE', label: 'Paciente', icon: 'ti-heart',           desc: 'Quiero cuidar mi salud y la de los míos' },
  { value: 'MEDICO',   label: 'Médico',   icon: 'ti-stethoscope',     desc: 'Brindo atención médica profesional' },
  { value: 'CUIDADOR', label: 'Cuidador', icon: 'ti-heart-handshake', desc: 'Acompaño y apoyo a otra persona' },
];

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({ name:'', email:'', password:'', phone:'', userType:'PACIENTE' });
  const [showPw, setShowPw]   = useState(false);
  const [btnState, setBtnState] = useState('idle');
  const [error, setError]     = useState('');
  const [fieldErr, setFieldErr] = useState('');
  const [shaking, setShaking] = useState(false);

  const btnRef = useRef(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const phoneValid = /^[+]?[\d\s-]{6,15}$/.test(form.phone.trim());
  const canSubmitStep1 = form.name.trim().length > 1 && emailValid && form.password.length >= 6;
  const canSubmitStep2 = phoneValid && !!form.userType;
  const strength   = getStrength(form.password);
  const firstName  = form.name.trim().split(' ')[0] || '';

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
    el.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-rect.left-d/2}px;top:${e.clientY-rect.top-d/2}px;`;
    btn.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
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
      setTimeout(() => navigate('/login', { state: { successMessage: 'Registro exitoso, ahora inicia sesión.' } }), 1100);
    } catch (err) {
      setBtnState('idle');
      setShaking(true); setTimeout(() => setShaking(false), 380);
      const data = err.response?.data;
      if (data?.email) {
        setStep(1);
        setFieldErr('El correo ya está registrado.');
      } else if (data?.password) {
        setStep(1);
        setFieldErr(Array.isArray(data.password) ? data.password[0] : 'La contraseña no cumple los requisitos.');
      } else if (data?.phone) {
        setFieldErr(Array.isArray(data.phone) ? data.phone[0] : 'El teléfono ya está registrado.');
      } else {
        setError(getApiErrorMessage(err, 'Error al registrar la cuenta.'));
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

          <p className="auth-brand-headline">Tu salud,<br/>protegida con IA</p>
          <p className="auth-brand-sub">Únete a más de 12,000 usuarios que confían en MediGuard para proteger su salud.</p>

          <div className="auth-brand-divider" />

          <div className="auth-brand-bullets">
            <div className="auth-brand-bullet">
              <div className="auth-brand-bullet-icon"><i className="ti ti-shield-check" /></div>
              <div>
                <p className="auth-brand-bullet-label">Datos 100% seguros</p>
                <p className="auth-brand-bullet-desc">Cifrado de grado hospitalario con HIPAA</p>
              </div>
            </div>
            <div className="auth-brand-bullet">
              <div className="auth-brand-bullet-icon"><i className="ti ti-urgent" /></div>
              <div>
                <p className="auth-brand-bullet-label">Alertas de emergencia</p>
                <p className="auth-brand-bullet-desc">Notificaciones instantáneas a tus contactos</p>
              </div>
            </div>
            <div className="auth-brand-bullet">
              <div className="auth-brand-bullet-icon"><i className="ti ti-bell-ringing" /></div>
              <div>
                <p className="auth-brand-bullet-label">Recordatorios médicos</p>
                <p className="auth-brand-bullet-desc">Medicamentos y citas gestionados con IA</p>
              </div>
            </div>
          </div>

          <div className="auth-brand-footer">
            <p className="auth-brand-tagline">Plataforma médica inteligente</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className={`auth-form-panel${shaking ? ' shake' : ''}`}>

          {step === 1 && (
            <div className="auth-tabs">
              <Link to="/login" className="auth-tab" style={{ display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
                Iniciar sesión
              </Link>
              <button className="auth-tab active" type="button">Crear cuenta</button>
            </div>
          )}

          {/* Indicador de progreso */}
          <div className="auth-steps">
            <span className={`auth-step-dot${step >= 1 ? ' active' : ''}`}>
              {step > 1 ? <i className="ti ti-check" style={{ fontSize:13 }} /> : '1'}
            </span>
            <span className={`auth-step-line${step > 1 ? ' done' : ''}`} />
            <span className={`auth-step-dot${step >= 2 ? ' active' : ''}`}>2</span>
            <span className="auth-step-label">Paso {step} de 2</span>
          </div>

          {error && (
            <div className="auth-error-banner">
              <i className="ti ti-x" style={{ fontSize:14 }} />{error}
            </div>
          )}

          {step === 1 ? (
            <>
              <h1 className="auth-form-title">Empieza gratis hoy</h1>
              <p className="auth-form-sub">Sin tarjeta de crédito · listo en 60 segundos</p>

              <form onSubmit={goToStep2} noValidate>
                {/* Nombre */}
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

                {/* Email */}
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

                {/* Password */}
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
                        {[0,1,2,3].map(i => (
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
                  Continuar <i className="ti ti-arrow-right" style={{ fontSize:15 }} />
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
                {/* Teléfono */}
                <div className="auth-field">
                  <label className="auth-label">Teléfono</label>
                  <div className="auth-input-wrap">
                    <i className="ti ti-phone auth-input-icon" />
                    <input
                      className={`auth-input${fieldErr && fieldErr.includes('teléfono') ? ' is-error' : ''}`}
                      type="tel"
                      name="phone"
                      placeholder="987 654 321"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={onChange}
                    />
                  </div>
                  <span className="auth-form-hint">Lo usaremos para alertar a tus contactos en una emergencia.</span>
                  {fieldErr && fieldErr.includes('teléfono') && (
                    <span className="auth-field-error show">{fieldErr}</span>
                  )}
                </div>

                {/* Tipo de usuario */}
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
                  disabled={!canSubmitStep2 || btnState === 'loading' || btnState === 'success'}
                >
                  {btnState === 'loading' && <><span className="auth-spinner" />Creando cuenta…</>}
                  {btnState === 'success' && <><i className="ti ti-circle-check" style={{ fontSize:17 }} />¡Cuenta creada!</>}
                  {btnState === 'idle'    && <>Crear mi cuenta gratis <i className="ti ti-arrow-right" style={{ fontSize:15 }} /></>}
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
