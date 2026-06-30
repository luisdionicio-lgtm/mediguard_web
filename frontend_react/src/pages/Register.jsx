import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';
import AuthBackground from '../components/AuthBackground';
import PhoneInput from '../components/PhoneInput';

function useCounter(target, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const raf = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const MINI_STATS = [
  { icon: 'ti ti-users',      target: 12480, suffix: '+', label: 'usuarios activos', color: '#059669' },
  { icon: 'ti ti-star',       target: 98,    suffix: '%', label: 'satisfacción',     color: '#D97706' },
  { icon: 'ti ti-clock-bolt', target: 2,     suffix: 'min', label: 'respuesta SOS', color: '#DC2626' },
];

function MiniStat({ icon, target, suffix, label, color, delay }) {
  const val = useCounter(target, 1400);
  return (
    <div className="reg-mini-stat" style={{ animationDelay: `${delay}s` }}>
      <i className={icon} style={{ color, fontSize: 15 }} />
      <span className="reg-mini-stat-num" style={{ color }}>
        {val.toLocaleString()}{suffix}
      </span>
      <span className="reg-mini-stat-lbl">{label}</span>
    </div>
  );
}

function MiniStats() {
  return (
    <div className="reg-mini-stats">
      {MINI_STATS.map((s, i) => (
        <MiniStat key={s.label} {...s} delay={i * 0.1} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ESCENA ANIMADA — Primeros auxilios + Defensa Civil
   ═══════════════════════════════════════════════════ */
function EmergencyScene() {
  return (
    <svg
      width="232" height="340"
      viewBox="0 0 232 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: 'block', margin: '0 auto' }}
    >

      {/* ══════════════════════════════════
          1. AMBULANCIA (parte superior)
         ══════════════════════════════════ */}
      <g>
        {/* Carrocería */}
        <rect x="20" y="28" width="142" height="56" rx="10" fill="#fff" />
        <rect x="20" y="28" width="142" height="56" rx="10" stroke="#E5E7EB" strokeWidth="1.5" />
        {/* Cabina delantera */}
        <rect x="142" y="34" width="44" height="50" rx="8" fill="#F3F4F6" />
        <rect x="142" y="34" width="44" height="50" rx="8" stroke="#E5E7EB" strokeWidth="1.5" />
        {/* Parabrisas */}
        <rect x="148" y="40" width="32" height="24" rx="4" fill="#BFDBFE" opacity="0.8" />
        {/* Franja naranja lateral */}
        <rect x="20" y="52" width="142" height="10" fill="#F97316" opacity="0.85" />
        {/* Cruz roja */}
        <rect x="68" y="34" width="8" height="26" rx="3" fill="#DC2626" />
        <rect x="60" y="42" width="24" height="8" rx="3" fill="#DC2626" />
        {/* Texto AMBULANCIA (espejado) */}
        <text x="116" y="48" textAnchor="middle" fontSize="7" fontWeight="800"
          fontFamily="system-ui,sans-serif" fill="#1D4ED8" letterSpacing="2"
          transform="scale(-1,1) translate(-232,0)">AMBULANCIA</text>
        {/* Ruedas */}
        <circle cx="55"  cy="84" r="12" fill="#374151" />
        <circle cx="55"  cy="84" r="6"  fill="#6B7280" />
        <circle cx="160" cy="84" r="12" fill="#374151" />
        <circle cx="160" cy="84" r="6"  fill="#6B7280" />
        {/* Luces de sirena */}
        <rect x="130" y="24" width="16" height="8" rx="4" fill="#1D4ED8">
          <animate attributeName="opacity" values="1;0.2;1" dur="0.5s" repeatCount="indefinite" />
        </rect>
        <rect x="150" y="24" width="16" height="8" rx="4" fill="#EF4444">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="0.5s" repeatCount="indefinite" />
        </rect>
        {/* Destello azul */}
        <circle cx="138" cy="28" r="14" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0">
          <animate attributeName="r"       values="8;20;8"    dur="0.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="0.5s" repeatCount="indefinite" />
        </circle>
        {/* Destello rojo */}
        <circle cx="158" cy="28" r="14" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0">
          <animate attributeName="r"       values="8;20;8"    dur="0.5s" repeatCount="indefinite" begin="0.25s" />
          <animate attributeName="opacity" values="0;0.5;0"   dur="0.5s" repeatCount="indefinite" begin="0.25s" />
        </circle>
      </g>

      {/* ══════════════════════════════════
          2. MONITOR DESFIBRILADOR (centro-izq)
         ══════════════════════════════════ */}
      <g transform="translate(10,112)">
        {/* Cuerpo */}
        <rect x="0" y="0" width="88" height="68" rx="8" fill="#1F2937" />
        <rect x="0" y="0" width="88" height="68" rx="8" stroke="#374151" strokeWidth="1.5" />
        {/* Pantalla */}
        <rect x="6" y="6" width="60" height="44" rx="4" fill="#052e16" />
        {/* ECG en pantalla */}
        <polyline
          points="8,28 16,28 20,18 24,38 28,12 32,28 44,28 48,22 52,34 56,28 68,28"
          stroke="#4ADE80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
        >
          <animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="1.8s" repeatCount="indefinite" />
        </polyline>
        {/* Punto pulsante */}
        <circle cx="68" cy="28" r="2.5" fill="#4ADE80">
          <animate attributeName="opacity" values="1;0.1;1" dur="0.9s" repeatCount="indefinite" />
          <animate attributeName="r"       values="2.5;4;2.5" dur="0.9s" repeatCount="indefinite" />
        </circle>
        {/* Controles laterales */}
        <rect x="70" y="8"  width="12" height="6" rx="3" fill="#EF4444" />
        <rect x="70" y="18" width="12" height="6" rx="3" fill="#F59E0B" />
        <rect x="70" y="28" width="12" height="6" rx="3" fill="#4ADE80" />
        {/* Label BPM */}
        <text x="34" y="58" textAnchor="middle" fontSize="7" fontWeight="700"
          fontFamily="system-ui,sans-serif" fill="#4ADE80">♥ 72 BPM</text>
        {/* Cables de palas */}
        <path d="M6 52 Q-8 60 -4 80" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M18 52 Q32 65 28 80" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Palas */}
        <rect x="-12" y="76" width="18" height="12" rx="4" fill="#374151" />
        <rect x="20"  y="76" width="18" height="12" rx="4" fill="#374151" />
      </g>

      {/* ══════════════════════════════════
          3. SOCORRISTA CON CASCO (derecha)
         ══════════════════════════════════ */}
      <g transform="translate(118,108)">
        {/* Cuerpo (chaleco naranja defensa civil) */}
        <rect x="16" y="36" width="36" height="48" rx="10" fill="#F97316" />
        {/* Chaleco reflectante */}
        <rect x="16" y="52" width="36" height="6" fill="#FCD34D" opacity="0.8" />
        <rect x="16" y="66" width="36" height="6" fill="#FCD34D" opacity="0.8" />
        {/* Cabeza */}
        <circle cx="34" cy="24" r="14" fill="#FDE68A" />
        {/* Casco */}
        <path d="M20 22 Q20 6 34 6 Q48 6 48 22Z" fill="#DC2626" />
        <rect x="18" y="20" width="32" height="5" rx="2" fill="#B91C1C" />
        {/* Cara */}
        <circle cx="29" cy="24" r="2" fill="#92400E" />
        <circle cx="39" cy="24" r="2" fill="#92400E" />
        <path d="M29 31 Q34 35 39 31" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Cruz en chaleco */}
        <rect x="30" y="40" width="8" height="22" rx="3" fill="#fff" opacity="0.9" />
        <rect x="24" y="46" width="20" height="8" rx="3" fill="#fff" opacity="0.9" />
        {/* Brazo izquierdo */}
        <rect x="4" y="38" width="14" height="32" rx="7" fill="#F97316" />
        {/* Brazo derecho con radio */}
        <rect x="50" y="38" width="14" height="32" rx="7" fill="#F97316" />
        {/* Radio/walkie-talkie */}
        <rect x="56" y="32" width="10" height="18" rx="3" fill="#1F2937" />
        <rect x="59" y="29" width="4" height="6" rx="2" fill="#374151" />
        <circle cx="61" cy="38" r="3" fill="#EF4444">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
        {/* Piernas */}
        <rect x="18" y="82" width="14" height="30" rx="7" fill="#1D4ED8" />
        <rect x="36" y="82" width="14" height="30" rx="7" fill="#1D4ED8" />
        {/* Botas */}
        <rect x="16" y="108" width="18" height="10" rx="4" fill="#111827" />
        <rect x="34" y="108" width="18" height="10" rx="4" fill="#111827" />
      </g>

      {/* ══════════════════════════════════
          4. BOTIQUÍN DE EMERGENCIA (pie-izq)
         ══════════════════════════════════ */}
      <g transform="translate(12,222)">
        <rect x="0" y="0" width="56" height="44" rx="8" fill="#DC2626" />
        <rect x="0" y="0" width="56" height="44" rx="8" stroke="#991B1B" strokeWidth="1.5" />
        {/* Tapa */}
        <rect x="0" y="0" width="56" height="20" rx="8" fill="#EF4444" />
        <rect x="0" y="10" width="56" height="10" fill="#DC2626" />
        {/* Asa */}
        <path d="M14 0 Q14 -10 28 -10 Q42 -10 42 0" stroke="#B91C1C" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Cruz */}
        <rect x="24" y="4"  width="8" height="22" rx="3" fill="#fff" />
        <rect x="14" y="12" width="28" height="8"  rx="3" fill="#fff" />
        {/* Broche */}
        <rect x="22" y="17" width="12" height="7" rx="2" fill="#B91C1C" />
      </g>

      {/* ══════════════════════════════════
          5. ESCUDO DEFENSA CIVIL (pie-der)
         ══════════════════════════════════ */}
      <g transform="translate(142,218)">
        {/* Escudo */}
        <path d="M40 0 L76 14 L76 44 Q76 70 40 82 Q4 70 4 44 L4 14 Z" fill="#1D4ED8" />
        <path d="M40 6 L70 18 L70 44 Q70 66 40 76 Q10 66 10 44 L10 18 Z" fill="#2563EB" />
        {/* Cruz blanca */}
        <rect x="35" y="22" width="10" height="30" rx="3" fill="#fff" opacity="0.95" />
        <rect x="24" y="32" width="32" height="10" rx="3" fill="#fff" opacity="0.95" />
        {/* Estrella de vida (6 puntas simplificada) */}
        <circle cx="40" cy="37" r="7" fill="#fff" opacity="0.15" />
        {/* Borde destello */}
        <path d="M40 0 L76 14 L76 44 Q76 70 40 82 Q4 70 4 44 L4 14 Z"
          fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Texto */}
        <text x="40" y="58" textAnchor="middle" fontSize="6" fontWeight="800"
          fontFamily="system-ui,sans-serif" fill="#fff" letterSpacing="0.5">DEFENSA</text>
        <text x="40" y="67" textAnchor="middle" fontSize="6" fontWeight="800"
          fontFamily="system-ui,sans-serif" fill="#fff" letterSpacing="0.5">CIVIL</text>
      </g>

      {/* ══════════════════════════════════
          6. ECG BASAL (franja horizontal)
         ══════════════════════════════════ */}
      <polyline
        points="10,310 26,310 32,296 38,324 44,284 50,310 66,310 72,302 78,318 84,310 116,310 122,298 128,322 134,286 140,310 158,310 162,304 166,316 170,310 220,310"
        stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        fill="none" opacity="0.8"
      >
        <animate attributeName="stroke-dasharray" from="0 600" to="600 0" dur="2.4s" repeatCount="indefinite" />
      </polyline>
      <line x1="10" y1="310" x2="220" y2="310" stroke="rgba(74,222,128,0.1)" strokeWidth="1" />
      {/* Punto final */}
      <circle cx="220" cy="310" r="4" fill="#4ADE80">
        <animate attributeName="r"       values="4;7;4"    dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.1;1"  dur="1s" repeatCount="indefinite" />
      </circle>

      {/* ══════════════════════════════════
          7. PARTÍCULAS FLOTANTES
         ══════════════════════════════════ */}
      {[
        [14,100,'#EF4444',1.4],
        [218,106,'#4ADE80',1.7],
        [210,218,'#F59E0B',2.0],
        [14,218,'#3B82F6',1.5],
        [116,98,'#fff',1.9],
      ].map(([cx,cy,color,dur],i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill={color} opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.05;0.5" dur={`${dur}s`} repeatCount="indefinite" begin={`${i*0.4}s`} />
          <animate attributeName="r"       values="3.5;6;3.5"    dur={`${dur}s`} repeatCount="indefinite" begin={`${i*0.4}s`} />
        </circle>
      ))}

      {/* ══════════════════════════════════
          8. ALERTA SOS (esquina sup-der)
         ══════════════════════════════════ */}
      <g transform="translate(192,10)">
        <circle cx="0" cy="0" r="16" fill="#DC2626" />
        <circle cx="0" cy="0" r="16" fill="none" stroke="#EF4444" strokeWidth="2">
          <animate attributeName="r"       values="16;24;16"    dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8"   dur="1s" repeatCount="indefinite" />
        </circle>
        <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="900"
          fontFamily="system-ui,sans-serif" fill="#fff">SOS</text>
      </g>

    </svg>
  );
}

/* ── Password strength ── */
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label:'Débil',      color:'var(--error)' },
    { label:'Débil',      color:'var(--error)' },
    { label:'Regular',    color:'var(--warning)' },
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
      setTimeout(() => navigate('/dashboard'), 1100);
    } catch (err) {
      setBtnState('idle');
      setShaking(true); setTimeout(() => setShaking(false), 380);
      const errors = err.response?.data?.errors || {};
      if (errors.email?.length) {
        setStep(1);
        setFieldErr(errors.email[0]);
      } else if (errors.password?.length) {
        setStep(1);
        setFieldErr(errors.password[0]);
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

        {/* ── Left brand panel ── */}
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

          <p className="auth-brand-headline">Responde.<br /><em>Protege. Salva.</em></p>
          <p className="auth-brand-sub">Únete a la red de respuesta de emergencias médicas más avanzada del país.</p>

          {/* Escena animada */}
          <div style={{ margin: '10px 0 8px' }}>
            <EmergencyScene />
          </div>

          <div className="auth-brand-divider" />

          <div className="auth-brand-bullets">
            {[
              { icon: 'ti ti-ambulance',      label: 'Respuesta inmediata', desc: 'Coordinación con unidades en tiempo real' },
              { icon: 'ti ti-shield-check',   label: 'Datos 100% seguros',  desc: 'Cifrado de grado hospitalario HIPAA' },
              { icon: 'ti ti-bell-ringing',   label: 'Alertas SOS',         desc: 'Notificación instantánea a contactos' },
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

          <MiniStats />

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
