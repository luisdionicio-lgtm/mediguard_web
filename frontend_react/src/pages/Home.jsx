import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Check,
  Phone, MapPin,
  Home as IconHome, Activity, AlertCircle, Map, User,
  Bot, Send, ChevronRight,
  Droplets, Pill, Waves, Bone, Baby, Thermometer,
  BookOpen, GraduationCap, FlaskConical, HeartPulse, Tablets,
} from 'lucide-react';
import '../styles/Home.css';

/* ── SVG: Apple & Android store icons ──────────────────────── */
function AppleIcon() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.523 15.341c-.36 0-.652-.29-.652-.651V9.01c0-.36.292-.652.652-.652.36 0 .651.292.651.652v5.68c0 .361-.291.651-.651.651zm-11.046 0c-.36 0-.651-.29-.651-.651V9.01c0-.36.29-.652.651-.652.36 0 .652.292.652.652v5.68c0 .361-.292.651-.652.651zM8.5 18v2.349c0 .36-.291.651-.651.651-.361 0-.652-.29-.652-.651V18H8.5zm7.652 0v2.349c0 .36-.291.651-.652.651-.36 0-.651-.29-.651-.651V18h1.303zM6.5 8v9h11V8H6.5zm4.5-5.882l-.876-1.517a.345.345 0 1 0-.6.345l.9 1.558A5.98 5.98 0 0 0 8 4.5h8a5.98 5.98 0 0 0-2.424-1.996l.9-1.558a.345.345 0 1 0-.6-.345L13 2.118A5.955 5.955 0 0 0 12 2c-.362 0-.715.04-1.055.118zM10 5a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0zm3 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0z"/>
    </svg>
  );
}

/* ── Phone Mockup ───────────────────────────────────────────── */
function PhoneMockup() {
  return (
    <div className="lp-phone" aria-hidden="true">
      <div className="lp-phone-screen">

        {/* Status bar */}
        <div className="lp-phone-statusbar">
          <span className="lp-phone-time">9:41</span>
          <span className="lp-phone-emergency-badge">EMERGENCIA ACTIVA</span>
        </div>

        {/* SOS */}
        <div className="lp-sos-section">
          <div className="lp-sos-btn-wrap">
            <div className="lp-sos-btn">
              <span className="lp-sos-btn-text">SOS</span>
              <span className="lp-sos-btn-sub">EMERGENCIA</span>
            </div>
          </div>
          <p className="lp-sos-hint">Mantén presionado para alertar contactos</p>
        </div>

        {/* Quick actions */}
        <div className="lp-phone-actions">
          <div className="lp-phone-action lp-phone-action-dark">
            <Phone size={12} />
            Llamar emergencia
          </div>
          <div className="lp-phone-action lp-phone-action-outline">
            <MapPin size={12} />
            Enviar mi ubicación
          </div>
        </div>

        {/* Tab bar */}
        <div className="lp-phone-tabbar">
          {[
            { icon: <IconHome size={14} />, label: 'Inicio', active: false },
            { icon: <Activity   size={14} />, label: 'Triaje', active: false },
            { icon: <AlertCircle size={14} />, label: 'SOS',    active: true  },
            { icon: <Map        size={14} />, label: 'Mapa',   active: false },
            { icon: <User       size={14} />, label: 'Perfil', active: false },
          ].map(t => (
            <div key={t.label} className={`lp-tab${t.active ? ' sos' : ''}`}>
              <span className="lp-tab-icon">{t.icon}</span>
              <span className="lp-tab-label">{t.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ── Courses email form ─────────────────────────────────────── */
function NotifyForm() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);

  const submit = e => {
    e.preventDefault();
    if (email.trim()) setSent(true);
  };

  if (sent) return (
    <p className="lp-notify-success">
      ¡Listo! Te avisaremos en cuanto estén disponibles.
    </p>
  );

  return (
    <form className="lp-notify-form" onSubmit={submit}>
      <label htmlFor="notify-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        Tu correo electrónico
      </label>
      <input
        id="notify-email"
        type="email"
        required
        placeholder="tu@correo.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="lp-email-input"
        autoComplete="email"
      />
      <button type="submit" className="lp-notify-btn">Notificarme</button>
      <p className="lp-notify-count">+340 personas esperando</p>
    </form>
  );
}

/* ── RESOURCES data ─────────────────────────────────────────── */
const RESOURCES = [
  {
    emoji: '🫀',
    imgStyle: { background: 'linear-gradient(160deg, #e0f5ed, #c5edd8)' },
    badge: { text: 'Gratis', cls: 'lp-badge-green' },
    tag: 'Primeros auxilios',
    title: 'RCP: guía paso a paso para adultos y niños',
    desc: 'Aprende la técnica correcta de reanimación cardiopulmonar con instrucciones claras.',
    meta: '📖 5 min de lectura',
  },
  {
    emoji: '🧠',
    imgStyle: { background: 'linear-gradient(160deg, #e3f0fc, #c0daf7)' },
    badge: { text: 'Nuevo', cls: 'lp-badge-pink' },
    tag: 'Salud mental',
    title: 'Cómo manejar una crisis de ansiedad en público',
    desc: 'Tips prácticos y técnicas de regulación que puedes aplicar en segundos.',
    meta: '📖 4 min de lectura',
  },
  {
    emoji: '🔥',
    imgStyle: { background: 'linear-gradient(160deg, #fef6e4, #fde5a0)' },
    badge: { text: 'Gratis', cls: 'lp-badge-green' },
    tag: 'Emergencias comunes',
    title: 'Quemaduras: qué hacer (y qué nunca hacer)',
    desc: 'Los errores más frecuentes al tratar una quemadura y el protocolo correcto.',
    meta: '📖 3 min de lectura',
  },
];

/* ── GUIDES data ─────────────────────────────────────────────── */
const GUIDES = [
  {
    icon: <Droplets size={20} />, cls: 'gi-red',
    title: 'Control de hemorragias',
    desc: 'Técnicas de presión directa, torniquetes y heridas de distintos tipos.',
    meta: 'PDF · 2.1MB',
  },
  {
    icon: <Pill size={20} />, cls: 'gi-green',
    title: 'Reacciones alérgicas',
    desc: 'Identificación de anafilaxia y uso correcto del autoinyector de epinefrina.',
    meta: 'PDF · 1.8MB',
  },
  {
    icon: <Waves size={20} />, cls: 'gi-blue',
    title: 'Ahogamiento y obstrucción',
    desc: 'Maniobra de Heimlich, ahogamiento parcial y total en adultos y niños.',
    meta: 'PDF · 1.5MB',
  },
  {
    icon: <Bone size={20} />, cls: 'gi-amber',
    title: 'Fracturas y traumatismos',
    desc: 'Inmovilización de emergencia, manejo del dolor y traslado seguro.',
    meta: 'PDF · 1.3MB',
  },
  {
    icon: <Baby size={20} />, cls: 'gi-purple',
    title: 'Emergencias pediátricas',
    desc: 'Protocolos específicos para lactantes y niños: dosis, técnicas y señales de alarma.',
    meta: 'PDF · 2.4MB',
  },
  {
    icon: <Thermometer size={20} />, cls: 'gi-teal',
    title: 'Golpe de calor',
    desc: 'Diferencias entre agotamiento y golpe de calor, enfriamiento de emergencia.',
    meta: 'PDF · 1.1MB',
  },
];

/* ── HOME PAGE ──────────────────────────────────────────────── */
/* ── STATS data ─────────────────────────────────────────────── */
const STATS_DATA = [
  {
    target: 12000,
    format: n => {
      if (n < 1000) return `${Math.round(n)}+`;
      const miles = Math.floor(n / 1000);
      const resto = String(Math.round(n % 1000)).padStart(3, '0');
      return `${miles}.${resto}+`;
    },
    label: 'Usuarios activos',
    sub: '↑ en crecimiento',
    fill: 88,   // % que llena la barra
  },
  {
    target: 300,
    format: n => `<${Math.round(n)}ms`,
    label: 'Latencia de alerta SOS',
    sub: 'respuesta en tiempo real',
    fill: 72,
  },
  {
    target: 40,
    format: n => `${Math.round(n)}+`,
    label: 'Guías offline disponibles',
    sub: 'sin conexión a internet',
    fill: 95,
  },
  {
    target: 4.9,
    format: n => `${n.toFixed(1)} ★`,
    label: 'Valoración promedio',
    sub: 'App Store & Google Play',
    fill: 98,
  },
];

/* ── StatsSection — count-up + barra de crecimiento ─────────── */
function StatsSection() {
  const wrapRef   = useRef(null);
  const [active,  setActive]   = useState(false);
  const [displays, setDisplays] = useState(STATS_DATA.map(s => s.format(0)));
  const [pops,    setPops]     = useState([false, false, false, false]);

  /* Observar la sección una sola vez */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); io.disconnect(); } },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Count-up cuando entra en vista */
  useEffect(() => {
    if (!active) return;
    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = 1600;
    const timers   = [];
    const rafs     = [];

    function ease(x) { return 1 - (1 - x) ** 4; } // easeOutQuart

    STATS_DATA.forEach((stat, i) => {
      const t = setTimeout(() => {
        if (reduced) {
          setDisplays(prev => { const n = [...prev]; n[i] = stat.format(stat.target); return n; });
          return;
        }
        const start = performance.now();
        function tick() {
          const p   = Math.min((performance.now() - start) / DURATION, 1);
          const val = stat.target * ease(p);
          setDisplays(prev => { const n = [...prev]; n[i] = stat.format(val); return n; });
          if (p < 1) { const id = requestAnimationFrame(tick); rafs.push(id); }
          else {
            /* valor final exacto + mini pop */
            setDisplays(prev => { const n = [...prev]; n[i] = stat.format(stat.target); return n; });
            setPops(prev => { const n = [...prev]; n[i] = true; return n; });
            setTimeout(() => setPops(prev => { const n = [...prev]; n[i] = false; return n; }), 350);
          }
        }
        const id = requestAnimationFrame(tick);
        rafs.push(id);
      }, i * 220);
      timers.push(t);
    });

    return () => { timers.forEach(clearTimeout); rafs.forEach(cancelAnimationFrame); };
  }, [active]);

  return (
    <div className="lp-stats-wrap" ref={wrapRef}>
      <div className="lp-stats" role="region" aria-label="Estadísticas de MediGuard AI">
        {STATS_DATA.map((s, i) => (
          <div
            key={s.label}
            className={`lp-stat${active ? ' stat-visible' : ''}${pops[i] ? ' stat-pop' : ''}`}
            style={{ '--bar-delay': `${i * 0.22}s` }}
          >
            <span className="lp-stat-num" aria-live="off">{displays[i]}</span>
            <span className="lp-stat-label">{s.label}</span>
            <span className="lp-stat-sub">{s.sub}</span>
            {/* Barra de crecimiento */}
            <div className="lp-stat-bar" aria-hidden="true">
              <div className="lp-stat-bar-fill" style={{ '--fill': `${s.fill}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main id="main-content">

      {/* ── 1. HERO ──────────────────────────────────────────── */}
      <section className="lp-hero" aria-labelledby="hero-heading">
        <div className="lp-hero-inner">

          {/* Left — text */}
          <div className="lp-hero-text">
            <div className="lp-hero-badge">
              <span className="lp-hero-badge-dot" aria-hidden="true" />
              Plataforma médica inteligente
            </div>

            <h1 id="hero-heading" className="lp-hero-h1">
              La asistencia vital que cabe en tu<br />
              <span className="accent">bolsillo</span>
            </h1>

            <p className="lp-hero-p">
              Respuesta inmediata en emergencias, guías offline de primeros auxilios y
              geolocalización médica. Todo en una sola app diseñada para salvar vidas.
            </p>

            <a href="#download" className="lp-hero-cta">
              <Download size={17} aria-hidden="true" />
              Descargar app gratis
            </a>

            <p className="lp-hero-micro" aria-label="Sin registro obligatorio para emergencias">
              <Check size={13} aria-hidden="true" style={{ color: '#1a7a5e' }} />
              Sin registro obligatorio para emergencias
            </p>
          </div>

          {/* Right — phone */}
          <div className="lp-hero-phone-col">
            <PhoneMockup />
          </div>

        </div>
      </section>

      {/* ── 2. STATS ─────────────────────────────────────────── */}
      <StatsSection />

      {/* ── 3. RECURSOS EDUCATIVOS ───────────────────────────── */}
      <section className="lp-resources" id="recursos" aria-labelledby="res-heading">

        <div className="lp-section-header">
          <div className="lp-section-header-left">
            <span className="lp-eyebrow">Recursos gratuitos</span>
            <h2 id="res-heading" className="lp-section-h2">Aprende antes de necesitarlo</h2>
          </div>
          <a href="#guias" className="lp-section-link">
            Ver todos los recursos <ChevronRight size={14} aria-hidden="true" />
          </a>
        </div>

        <ul className="lp-res-cards" role="list">
          {RESOURCES.map(r => (
            <li key={r.title} className="lp-res-card" role="listitem">
              {/* Gradient image area */}
              <div className="lp-res-card-img" style={r.imgStyle} aria-hidden="true">
                <span role="img">{r.emoji}</span>
                <span className={`lp-res-card-badge ${r.badge.cls}`}>{r.badge.text}</span>
              </div>

              {/* Body */}
              <div className="lp-res-card-body">
                <span className="lp-res-card-tag">{r.tag}</span>
                <h3 className="lp-res-card-title">{r.title}</h3>
                <p  className="lp-res-card-desc">{r.desc}</p>
              </div>

              {/* Footer */}
              <div className="lp-res-card-footer">
                <span>{r.meta}</span>
                <a href="#guias" className="lp-res-read-link">
                  Leer <ChevronRight size={12} aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 4. CURSOS — COMING SOON ──────────────────────────── */}
      <div className="lp-courses-wrap">
        <section className="lp-courses" id="cursos" aria-labelledby="courses-heading">

          {/* Left — text */}
          <div>
            <div className="lp-courses-label">
              <span className="lp-courses-dot" aria-hidden="true" />
              Próximamente — Cursos MediGuard
            </div>

            <h2 id="courses-heading" className="lp-courses-h2">
              La formación que puede salvar una vida está en camino.
            </h2>

            <p className="lp-courses-p">
              Estamos diseñando cursos certificados de primeros auxilios, triaje doméstico
              y respuesta a emergencias. Interactivos, offline y pensados para cualquier persona.
            </p>

            <div className="lp-courses-pills" role="list" aria-label="Temas próximos">
              {[
                { icon: <GraduationCap size={14} aria-hidden="true" />, text: 'Primeros auxilios básicos' },
                { icon: <FlaskConical  size={14} aria-hidden="true" />, text: 'Triaje doméstico' },
                { icon: <HeartPulse   size={14} aria-hidden="true" />, text: 'Emergencias pediátricas' },
                { icon: <Tablets      size={14} aria-hidden="true" />, text: 'Medicamentos de urgencia' },
              ].map(p => (
                <span key={p.text} className="lp-course-pill" role="listitem">
                  {p.icon} {p.text}
                </span>
              ))}
            </div>
          </div>

          {/* Right — notify box */}
          <div className="lp-notify-box">
            <h3 className="lp-notify-title">Sé el primero en saber</h3>
            <p className="lp-notify-sub">
              Te avisamos cuando los cursos estén disponibles.
            </p>
            <NotifyForm />
          </div>

        </section>
      </div>

      {/* ── 5. CHAT IA ───────────────────────────────────────── */}
      <section className="lp-chat" id="chat" aria-labelledby="chat-heading">
        <div className="lp-chat-inner">

          {/* Left — description */}
          <div className="lp-chat-text">
            <span className="lp-eyebrow">Inteligencia artificial</span>
            <h2 id="chat-heading" className="lp-chat-h2">
              Un asistente médico disponible 24/7
            </h2>
            <p className="lp-chat-p">
              Describe tus síntomas y recibe orientación inmediata basada en IA.
              No reemplaza al médico — te ayuda a decidir qué tan urgente es la situación.
            </p>

            <ul className="lp-check-list" aria-label="Capacidades del asistente">
              {[
                'Evalúa síntomas y clasifica urgencia',
                'Sugiere primeros pasos mientras esperas ayuda',
                'Disponible sin conexión en la app',
              ].map(item => (
                <li key={item} className="lp-check-item">
                  <span className="lp-check-box" aria-hidden="true">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — chat demo */}
          <div className="lp-chat-window" role="region" aria-label="Demo del asistente IA">

            {/* Header */}
            <div className="lp-chat-head">
              <div className="lp-chat-avatar" aria-hidden="true">
                <Bot size={18} />
              </div>
              <div>
                <p className="lp-chat-name">MediGuard IA</p>
                <p className="lp-chat-online">
                  <span className="lp-online-dot" aria-hidden="true" />
                  En línea
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="lp-chat-body" aria-label="Conversación de ejemplo">

              <div className="lp-chat-bubble lp-bubble-user" role="article" aria-label="Mensaje del usuario">
                "Me duele mucho el pecho y tengo el brazo izquierdo adormecido desde hace 10 minutos"
              </div>

              <div className="lp-chat-bubble lp-bubble-ai" role="article" aria-label="Respuesta del asistente">
                ⚠️ Prioridad alta. Estos síntomas pueden indicar un evento cardíaco. Llama a emergencias ahora mismo o pide a alguien que lo haga. Mientras esperas: siéntate, no hagas esfuerzo. Si tienes aspirina disponible, mastícala (no tragar entera).
              </div>

              <div className="lp-chat-alert" role="alert">
                🚨 <strong>Activar SOS automático</strong> — Toca para alertar a tus contactos de emergencia
              </div>

            </div>

            {/* Input row */}
            <div className="lp-chat-input-row" aria-hidden="true">
              <div className="lp-chat-input-mock">Describe tus síntomas...</div>
              <button type="button" className="lp-chat-send-btn" tabIndex={-1} aria-hidden="true">
                <Send size={14} />
              </button>
            </div>

            {/* Disclaimer */}
            <p className="lp-chat-disclaimer" role="note">
              ⚠️ No sustituye el diagnóstico médico profesional
            </p>

          </div>
        </div>
      </section>

      {/* ── 6. GUÍAS DESCARGABLES ────────────────────────────── */}
      <section className="lp-guides" id="guias" aria-labelledby="guides-heading">

        <div className="lp-guides-header">
          <span className="lp-eyebrow">Guías offline</span>
          <h2 id="guides-heading" className="lp-section-h2">Disponibles sin internet</h2>
          <p className="lp-guides-sub">
            Descarga las guías a tu dispositivo. En una emergencia real no siempre hay señal.
          </p>
        </div>

        <ul className="lp-guides-grid" role="list" aria-label="Catálogo de guías">
          {GUIDES.map(g => (
            <li key={g.title} className="lp-guide-card" role="listitem">
              <div className={`lp-guide-icon ${g.cls}`} aria-hidden="true">
                {g.icon}
              </div>
              <h3 className="lp-guide-title">{g.title}</h3>
              <p  className="lp-guide-desc">{g.desc}</p>
              <div className="lp-guide-footer">
                <span className="lp-guide-meta">📄 {g.meta}</span>
                <a href="#guias" className="lp-guide-dl" aria-label={`Descargar guía: ${g.title}`}>
                  Descargar <ChevronRight size={12} aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 7. CTA FINAL ─────────────────────────────────────── */}
      <section className="lp-cta" id="download" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="lp-cta-h2">
          Prepárate hoy.<br />Las emergencias no avisan.
        </h2>
        <p className="lp-cta-sub">
          Descarga gratis. Sin registro para usar el SOS. Sin suscripción obligatoria.
        </p>

        <div className="lp-cta-btns">
          <a href="#download" className="lp-store-btn lp-store-dark" aria-label="Descargar en App Store">
            <AppleIcon />
            <div className="lp-store-texts">
              <span className="lp-store-sm">Disponible en</span>
              <span className="lp-store-lg">App Store</span>
            </div>
          </a>
          <a href="#download" className="lp-store-btn lp-store-light" aria-label="Descargar en Google Play">
            <AndroidIcon />
            <div className="lp-store-texts">
              <span className="lp-store-sm">Disponible en</span>
              <span className="lp-store-lg">Google Play</span>
            </div>
          </a>
        </div>
      </section>

    </main>
  );
}
