import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Check,
  MapPin,
  Home as IconHome, Activity, AlertCircle, Map, User,
  Bot, Send, ChevronRight,
  Droplets, Pill, Waves, Bone, Baby, Thermometer,
  Users, BookOpen, Shield, Zap, Clock, Heart,
  PhoneCall, AlertTriangle, Siren, TrendingUp,
  Search,
} from 'lucide-react';
import { OFFLINE_GUIDES } from '../data/learnGuides';
import '../styles/Home.css';

/*
  PALETA 2025 — MediGuard AI
  ─────────────────────────────────────────────────────
  #inicio   Hero          #0d4f3c   teal oscuro vivo
  #about    Nosotros      #ffffff   blanco
  #recursos Guías         #0f766e   teal-700 vibrante
  #chat     IA Chat       #eff6ff   azul cielo muy claro
  #features ¿Cuándo?      #0c4a6e   azul océano profundo
  #download Descarga      #f0fdf4   mint suave
  #mision   Misión        #fafafa   blanco cálido
  Footer                  #0f1f1c   (Footer.jsx)
  ─────────────────────────────────────────────────────
*/

/* ── SVG Store Icons ────────────────────────────────────────── */
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
  const QUICK = [
    { icon: <Heart size={22} />,       label: ['RCP',         'Adultos']    },
    { icon: <Droplets size={22} />,    label: ['Control',     'Sangrado']   },
    { icon: <MapPin size={22} />,      label: ['Hospitales',  'Cercanos']   },
    { icon: <Thermometer size={22} />, label: ['Guías',       'Offline']    },
  ];
  const TABS = [
    { icon: <IconHome size={18} />,    label: 'Inicio', sos: false },
    { icon: <Activity size={18} />,    label: 'Triaje', sos: false },
    { icon: <AlertCircle size={18} />, label: 'SOS',    sos: true  },
    { icon: <Map size={18} />,         label: 'Mapa',   sos: false },
    { icon: <User size={18} />,        label: 'Perfil', sos: false },
  ];
  return (
    <div className="lp-phone" aria-hidden="true">
      <div className="lp-phone-screen">
        {/* Status bar */}
        <div className="lp-phone-statusbar">
          <span className="lp-phone-time">9:41</span>
          <span className="lp-phone-emergency-badge">EMERGENCIA</span>
        </div>

        {/* SOS Button con glow */}
        <div className="lp-sos-section">
          <div className="lp-sos-btn-wrap">
            <div className="lp-sos-btn">
              <span className="lp-sos-btn-text">SOS</span>
              <span className="lp-sos-btn-sub">MANTENER</span>
            </div>
          </div>
          <p className="lp-sos-hint">Alertar contactos de emergencia</p>
        </div>

        <div className="lp-phone-divider" />

        {/* 2×2 acceso rápido */}
        <div className="lp-phone-quick-grid">
          {QUICK.map(q => (
            <div key={q.label[0]} className="lp-phone-quick-item">
              <span className="lp-phone-quick-icon">{q.icon}</span>
              <span className="lp-phone-quick-label">{q.label[0]}<br />{q.label[1]}</span>
            </div>
          ))}
        </div>

        <div className="lp-phone-divider" />

        {/* Tab bar */}
        <div className="lp-phone-tabbar">
          {TABS.map(t => (
            <div key={t.label} className={`lp-tab${t.sos ? ' sos' : ''}`}>
              <span className="lp-tab-icon">{t.icon}</span>
              <span className="lp-tab-label">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Data ───────────────────────────────────────────────────── */
const RESOURCES = [
  { slug: 'rcp',        emoji: '🫀', imgStyle: { background: 'linear-gradient(160deg,#e0f5ed,#c5edd8)' }, badge: { text: 'Gratis', cls: 'lp-badge-green' }, tag: 'Primeros auxilios',  title: 'RCP: guía paso a paso para adultos y niños',    desc: 'Aprende la técnica correcta de reanimación cardiopulmonar con instrucciones claras.', meta: '📖 5 min' },
  { slug: 'ansiedad',   emoji: '🧠', imgStyle: { background: 'linear-gradient(160deg,#e3f0fc,#c0daf7)' }, badge: { text: 'Nuevo',  cls: 'lp-badge-pink'  }, tag: 'Salud mental',       title: 'Cómo manejar una crisis de ansiedad en público', desc: 'Tips prácticos y técnicas de regulación que puedes aplicar en segundos.',            meta: '📖 4 min' },
  { slug: 'quemaduras', emoji: '🔥', imgStyle: { background: 'linear-gradient(160deg,#fef6e4,#fde5a0)' }, badge: { text: 'Gratis', cls: 'lp-badge-green' }, tag: 'Emergencias comunes',title: 'Quemaduras: qué hacer (y qué nunca hacer)',      desc: 'Los errores más frecuentes al tratar una quemadura y el protocolo correcto.',        meta: '📖 3 min' },
];

const GUIDE_VISUALS = {
  'control-hemorragias': { icon: <Droplets size={20} />, cls: 'gi-red' },
  'reacciones-alergicas': { icon: <Pill size={20} />, cls: 'gi-green' },
  'ahogamiento-obstruccion': { icon: <Waves size={20} />, cls: 'gi-blue' },
  'fracturas-traumatismos': { icon: <Bone size={20} />, cls: 'gi-amber' },
  'emergencias-pediatricas': { icon: <Baby size={20} />, cls: 'gi-purple' },
  'golpe-calor': { icon: <Thermometer size={20} />, cls: 'gi-teal' },
};

const GUIDES = OFFLINE_GUIDES.map((guide) => ({
  ...guide,
  ...GUIDE_VISUALS[guide.slug],
}));

const WHEN_CARDS = [
  { icon: <Siren size={24} />,         color: '#f87171', label: 'Llama al 911',    urgency: 'URGENTE',     items: ['Dolor en el pecho o brazo izquierdo', 'Dificultad para respirar severa', 'Pérdida de conciencia', 'Convulsiones o parálisis facial'] },
  { icon: <AlertTriangle size={24} />, color: '#fb923c', label: 'Ve a urgencias',  urgency: 'PRONTO',      items: ['Fiebre alta que no baja con medicamento', 'Herida profunda o sangrado abundante', 'Dolor abdominal severo', 'Fractura o luxación visible'] },
  { icon: <Clock size={24} />,         color: '#fbbf24', label: 'Consulta médica', urgency: 'ESTA SEMANA', items: ['Síntomas que persisten más de 3 días', 'Infección que no mejora', 'Mareos recurrentes sin causa clara', 'Cambios en visión o audición'] },
  { icon: <Heart size={24} />,         color: '#34d399', label: 'Autocuidado',     urgency: 'EN CASA',     items: ['Resfriado común sin fiebre alta', 'Dolor muscular post-ejercicio', 'Quemadura superficial pequeña', 'Corte leve con sangrado menor'] },
];

const TEAM = [
  { emoji: '💻', name: 'Equipo de desarrollo', role: 'Ingeniería de Software', desc: 'Estudiantes de Tecsup construyendo tecnología que salva vidas.' },
  { emoji: '🩺', name: 'Asesores médicos',      role: 'Salud y protocolos',    desc: 'Profesionales de salud que validan cada protocolo de emergencia.' },
  { emoji: '🤝', name: 'Comunidad',             role: 'Usuarios y feedback',   desc: 'Más de 12,000 personas que ya confían en MediGuard AI cada día.' },
];

/* ── Eyebrow pill helper ────────────────────────────────────── */
function EyebrowPill({ text, bg, color }) {
  return (
    <span style={{ display: 'inline-block', background: bg, color, padding: '4px 14px', borderRadius: 50, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 14 }}>
      {text}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const [guideQuery, setGuideQuery] = useState('');
  const normalizedGuideQuery = guideQuery.trim().toLocaleLowerCase('es');
  const filteredGuides = GUIDES.filter((guide) => (
    `${guide.title} ${guide.summary} ${guide.category}`
      .toLocaleLowerCase('es')
      .includes(normalizedGuideQuery)
  ));

  return (
    <main id="main-content">

      {/* ══════════════════════════════════════════════════════
          1. HERO  —  MediAlert  #0D2B1A
         ══════════════════════════════════════════════════════ */}
      <section
        id="inicio"
        className="lp-hero"
        aria-labelledby="hero-heading"
      >
        <div className="lp-hero-inner">

          {/* Columna izquierda — texto */}
          <div className="lp-hero-text">
            {/* Badge pill */}
            <div className="lp-hero-badge">
              <span className="lp-hero-badge-dot" aria-hidden="true" />
              App médica de emergencias · MediAlert
            </div>

            {/* H1 tres líneas */}
            <h1 id="hero-heading" className="lp-hero-h1">
              En una emergencia,<br />
              cada segundo<br />
              <span className="accent">puede salvarte.</span>
            </h1>

            {/* Subtítulo */}
            <p className="lp-hero-p">
              Respuesta SOS inmediata, guías offline de primeros auxilios y
              geolocalización médica. Diseñada para salvar vidas.
            </p>

            {/* Botones */}
            <div className="lp-hero-btns">
              <a href="#download" className="lp-hero-cta">
                <Download size={16} aria-hidden="true" />
                Descargar gratis
              </a>
              <a href="#features" className="lp-hero-cta-secondary">
                Ver cómo funciona
                <ChevronRight size={15} aria-hidden="true" />
              </a>
            </div>

            {/* 4 Trust badges */}
            <div className="lp-hero-trust">
              {[
                { icon: <Zap size={14} />,        strong: 'SOS en < 3 segundos',       muted: 'alerta instantánea' },
                { icon: <Shield size={14} />,      strong: 'Guías offline validadas',   muted: 'sin internet necesario' },
                { icon: <MapPin size={14} />,      strong: 'Geolocalización médica',    muted: 'hospitales cercanos' },
                { icon: <Heart size={14} />,       strong: 'Protocolos certificados',   muted: 'revisados por médicos' },
              ].map(b => (
                <div key={b.strong} className="lp-trust-item">
                  <div className="lp-trust-icon" aria-hidden="true">{b.icon}</div>
                  <div>
                    <span className="lp-trust-strong">{b.strong}</span>
                    {' — '}
                    <span className="lp-trust-muted">{b.muted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha — phone mockup */}
          <div className="lp-hero-phone-col">
            <PhoneMockup />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. NOSOTROS  —  blanco #ffffff
         ══════════════════════════════════════════════════════ */}
      <section id="about" style={{ background: '#ffffff' }} aria-labelledby="about-heading">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 40px' }}>

          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <EyebrowPill text="Quiénes somos" bg="#eff6ff" color="#2563eb" />
            <h2 id="about-heading" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: '#0d4f3c', marginBottom: 16, lineHeight: 1.2 }}>
              Construido por estudiantes,<br />inspirado por la realidad
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.75 }}>
              MediGuard AI nació en las aulas de Tecsup con una pregunta simple:
              ¿qué pasa cuando alguien colapsa y nadie sabe qué hacer?
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, marginBottom: 72 }}>
            {[
              { icon: <Zap size={22} />,        bg: '#fef3c7', ic: '#d97706', title: 'El problema', text: 'Cada año miles de muertes podrían evitarse si las personas supieran responder en los primeros 4 minutos críticos.' },
              { icon: <BookOpen size={22} />,   bg: '#dbeafe', ic: '#2563eb', title: 'La solución', text: 'Una app con protocolos médicos validados, alertas SOS y guías offline en el bolsillo de cualquier persona.' },
              { icon: <TrendingUp size={22} />, bg: '#dcfce7', ic: '#16a34a', title: 'El impacto',  text: 'Más de 12,000 usuarios activos, 40+ guías sin internet y una comunidad que crece cada semana.' },
            ].map(card => (
              <div key={card.title} style={{ borderRadius: 16, padding: '28px 24px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.ic, marginBottom: 16 }}>
                  {card.icon}
                </div>
                <h3 style={{ color: '#0d4f3c', fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>{card.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.7 }}>{card.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h3 style={{ color: '#0d4f3c', fontWeight: 800, fontSize: '1.25rem', marginBottom: 6 }}>Las personas detrás del proyecto</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Un equipo multidisciplinario unido por una misión común</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 18 }}>
            {TEAM.map(t => (
              <div key={t.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '24px 20px', textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>{t.emoji}</div>
                <p style={{ color: '#0d4f3c', fontWeight: 700, fontSize: '0.97rem', marginBottom: 4 }}>{t.name}</p>
                <p style={{ color: '#0f766e', fontSize: '0.78rem', fontWeight: 600, marginBottom: 10 }}>{t.role}</p>
                <p style={{ color: '#64748b', fontSize: '0.87rem', lineHeight: 1.65 }}>{t.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. GUÍAS  —  teal vibrante #0f766e
         ══════════════════════════════════════════════════════ */}
      <section id="recursos" style={{ background: '#F0FDFA' }} aria-labelledby="res-heading">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 40px' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 52 }}>
            <div>
              <EyebrowPill text="Recursos gratuitos" bg="#CCFBF1" color="#0f766e" />
              <h2 id="res-heading" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 800, color: '#134E4A', lineHeight: 1.2 }}>
                Aprende antes de necesitarlo
              </h2>
            </div>
            <a href="#recursos" style={{ color: '#0f766e', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
              Ver todos <ChevronRight size={14} />
            </a>
          </div>

          {/* Cards de artículos */}
          <ul className="lp-res-cards" role="list" style={{ marginBottom: 64 }}>
            {RESOURCES.map(r => (
              <li key={r.title} className="lp-res-card" role="listitem"
                style={{ background: '#ffffff', border: '1px solid #CCFBF1' }}>
                <Link to={`/aprende/${r.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="lp-res-card-img" style={r.imgStyle} aria-hidden="true">
                    <span role="img">{r.emoji}</span>
                    <span className={`lp-res-card-badge ${r.badge.cls}`}>{r.badge.text}</span>
                  </div>
                </Link>
                <div className="lp-res-card-body">
                  <span className="lp-res-card-tag" style={{ color: '#0f766e' }}>{r.tag}</span>
                  <h3 className="lp-res-card-title" style={{ color: '#134E4A' }}>{r.title}</h3>
                  <p className="lp-res-card-desc" style={{ color: '#4B7C5E' }}>{r.desc}</p>
                </div>
                <div className="lp-res-card-footer" style={{ borderTop: '1px solid #CCFBF1' }}>
                  <span style={{ color: '#6B7280' }}>{r.meta}</span>
                  <Link to={`/aprende/${r.slug}`} className="lp-res-read-link" style={{ color: '#0f766e' }}>
                    Leer <ChevronRight size={12} />
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* Divisor */}
          <div style={{ height: 1, background: '#CCFBF1', marginBottom: 64 }} />

          {/* Guías descargables */}
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <EyebrowPill text="Guías offline" bg="#CCFBF1" color="#0f766e" />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#134E4A', marginBottom: 8 }}>Disponibles sin internet</h3>
            <p style={{ color: '#4B7C5E', fontSize: '0.95rem' }}>En una emergencia real no siempre hay señal.</p>
          </div>
          <label className="lp-guide-search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              aria-label="Buscar guías offline"
              value={guideQuery}
              onChange={(event) => setGuideQuery(event.target.value)}
              placeholder="Buscar por tema o categoría"
            />
          </label>
          <ul className="lp-guides-grid" role="list">
            {filteredGuides.map(g => (
              <li key={g.title} className="lp-guide-card" role="listitem"
                style={{ background: '#ffffff', border: '1px solid #CCFBF1' }}>
                <div className={`lp-guide-icon ${g.cls}`} aria-hidden="true">{g.icon}</div>
                <h3 className="lp-guide-title" style={{ color: '#134E4A' }}>{g.title}</h3>
                <p className="lp-guide-desc" style={{ color: '#4B7C5E' }}>{g.summary}</p>
                <div className="lp-guide-footer">
                  <span className="lp-guide-meta" style={{ color: '#6B7280' }}>📖 {g.estimatedReadTime}</span>
                  <div className="lp-guide-actions">
                    <Link to={`/aprende/${g.slug}`} className="lp-guide-link" style={{ color: '#0f766e' }}>
                      Ver guía <ChevronRight size={12} />
                    </Link>
                    {g.pdfUrl ? (
                      <a
                        href={g.pdfUrl}
                        className="lp-guide-dl"
                        style={{ color: '#0f766e' }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Descargar PDF <Download size={12} />
                      </a>
                    ) : (
                      <span className="lp-guide-dl is-disabled" aria-disabled="true">PDF no disponible</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {filteredGuides.length === 0 && (
            <p className="lp-guide-empty" role="status">No encontramos guías para “{guideQuery}”.</p>
          )}

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. IA CHAT  —  azul cielo claro #eff6ff
             Ventana flotante sobre fondo aéreo
         ══════════════════════════════════════════════════════ */}
      <section id="chat" style={{ background: '#eff6ff' }} aria-labelledby="chat-heading">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 40px' }}>

          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <EyebrowPill text="Inteligencia artificial" bg="#dbeafe" color="#1d4ed8" />
            <h2 id="chat-heading" style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: '#0c4a6e', marginBottom: 14, lineHeight: 1.2 }}>
              Tu asistente médico,<br />disponible 24/7
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
              Describe tus síntomas y recibe orientación inmediata.
              No reemplaza al médico — te ayuda a decidir qué tan urgente es la situación.
            </p>
          </div>

          {/* Ventana flotante centrada */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '100%', maxWidth: 560,
              background: '#ffffff',
              borderRadius: 20,
              boxShadow: '0 24px 64px rgba(12,74,110,0.18), 0 4px 16px rgba(12,74,110,0.08)',
              overflow: 'hidden',
              border: '1px solid #e0f2fe',
            }}>
              {/* Barra de ventana — estilo macOS */}
              <div style={{ background: '#f1f5f9', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f87171', display: 'inline-block' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24', display: 'inline-block' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>MediGuard IA — Asistente médico</span>
                </div>
              </div>

              {/* Header del chat */}
              <div className="lp-chat-head" style={{ borderBottom: '1px solid #f1f5f9' }}>
                <div className="lp-chat-avatar" aria-hidden="true"><Bot size={18} /></div>
                <div>
                  <p className="lp-chat-name">MediGuard IA</p>
                  <p className="lp-chat-online"><span className="lp-online-dot" aria-hidden="true" /> En línea · responde en segundos</p>
                </div>
                <div style={{ marginLeft: 'auto', background: '#f0fdf4', color: '#16a34a', fontSize: '0.72rem', fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: '1px solid #bbf7d0' }}>
                  GRATIS
                </div>
              </div>

              {/* Mensajes */}
              <div className="lp-chat-body" style={{ background: '#fafafa' }} aria-label="Conversación de ejemplo">
                <div className="lp-chat-bubble lp-bubble-user" role="article">
                  "Me duele mucho el pecho y tengo el brazo izquierdo adormecido desde hace 10 minutos"
                </div>
                <div className="lp-chat-bubble lp-bubble-ai" role="article">
                  ⚠️ <strong>Prioridad alta.</strong> Estos síntomas pueden indicar un evento cardíaco. Llama a emergencias ahora mismo o pide a alguien que lo haga. Mientras esperas: siéntate, no hagas esfuerzo.
                </div>
                <div className="lp-chat-alert" role="alert">
                  🚨 <strong>Activar SOS automático</strong> — Toca para alertar a tus contactos de emergencia
                </div>
              </div>

              {/* Input */}
              <div className="lp-chat-input-row" aria-hidden="true">
                <div className="lp-chat-input-mock">Describe tus síntomas...</div>
                <button type="button" className="lp-chat-send-btn" tabIndex={-1} aria-hidden="true">
                  <Send size={14} />
                </button>
              </div>

              {/* Disclaimer */}
              <p className="lp-chat-disclaimer" role="note">⚠️ No sustituye el diagnóstico médico profesional</p>
            </div>
          </div>

          {/* Features del asistente */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginTop: 52 }}>
            {[
              { icon: <Shield size={20} />,   bg: '#dbeafe', color: '#1d4ed8', title: 'Validado médicamente',  desc: 'Protocolos revisados por profesionales de salud.' },
              { icon: <Zap size={20} />,      bg: '#fef3c7', color: '#b45309', title: 'Respuesta inmediata',   desc: 'Orientación en segundos, sin esperas ni registros.' },
              { icon: <BookOpen size={20} />, bg: '#dcfce7', color: '#15803d', title: 'Sin conexión',          desc: 'Funciona offline cuando más lo necesitas.' },
              { icon: <Heart size={20} />,    bg: '#fce7f3', color: '#be185d', title: 'Centrado en ti',        desc: 'Personaliza tu perfil de salud y contactos SOS.' },
            ].map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: 14, padding: '20px 18px', border: '1px solid #e0f2fe', boxShadow: '0 2px 8px rgba(12,74,110,0.06)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 12 }}>
                  {f.icon}
                </div>
                <p style={{ color: '#0c4a6e', fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>{f.title}</p>
                <p style={{ color: '#64748b', fontSize: '0.84rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. ¿CUÁNDO ACTUAR?  —  azul océano #0c4a6e
         ══════════════════════════════════════════════════════ */}
      <section id="features" style={{ background: '#0c4a6e' }} aria-labelledby="features-heading">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 40px' }}>

          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <EyebrowPill text="Guía rápida" bg="rgba(255,255,255,0.12)" color="#bae6fd" />
            <h2 id="features-heading" style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: '#fff', marginBottom: 14, lineHeight: 1.2 }}>
              ¿Cuándo actuar y cómo?
            </h2>
            <p style={{ color: '#7dd3fc', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.75 }}>
              No todas las situaciones requieren el mismo nivel de respuesta.
              Aprende a identificar la urgencia antes de que llegue.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}>
            {WHEN_CARDS.map(card => (
              <div key={card.label} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 20px', border: `1px solid ${card.color}40`, backdropFilter: 'blur(6px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: `${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <p style={{ color: card.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>{card.urgency}</p>
                    <p style={{ color: '#f0f9ff', fontWeight: 700, fontSize: '0.97rem' }}>{card.label}</p>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {card.items.map(item => (
                    <li key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: '#7dd3fc', fontSize: '0.86rem', lineHeight: 1.55 }}>
                      <span style={{ color: card.color, flexShrink: 0, marginTop: 2 }}>•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. DESCARGA  —  mint suave #f0fdf4
         ══════════════════════════════════════════════════════ */}
      <section id="download" style={{ background: '#f0fdf4' }} aria-labelledby="download-heading">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '88px 40px', textAlign: 'center' }}>

          <EyebrowPill text="Descarga gratuita" bg="#dcfce7" color="#15803d" />
          <h2 id="download-heading" style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#0d4f3c', marginBottom: 16, lineHeight: 1.15 }}>
            Prepárate hoy.<br />Las emergencias no avisan.
          </h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Descarga gratis. Sin registro para usar el SOS. Sin suscripción obligatoria.
          </p>

          {/* Ratings */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
            {[
              { store: 'App Store',    rating: '4.9', reviews: '2.3k reseñas', icon: <AppleIcon /> },
              { store: 'Google Play',  rating: '4.8', reviews: '1.8k reseñas', icon: <AndroidIcon /> },
            ].map(s => (
              <div key={s.store} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: '14px 22px', boxShadow: '0 2px 10px rgba(13,79,60,0.08)' }}>
                <div style={{ color: '#0d4f3c' }}>{s.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ color: '#0d4f3c', fontWeight: 800, fontSize: '0.95rem' }}>{s.store}</p>
                  <p style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: 600 }}>
                    {'★'.repeat(5)} <span style={{ color: '#64748b' }}>{s.rating} · {s.reviews}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de tienda */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 40 }}>
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

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['100% gratuito', 'Sin anuncios', 'Sin suscripción', 'Offline disponible'].map(b => (
              <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#15803d', padding: '6px 14px', borderRadius: 50, fontSize: '0.82rem', fontWeight: 600 }}>
                <Check size={13} strokeWidth={3} /> {b}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. MISIÓN  —  blanco cálido #fafafa
         ══════════════════════════════════════════════════════ */}
      <section id="mision" style={{ background: '#fafafa' }} aria-labelledby="mision-heading">
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 40px', textAlign: 'center' }}>

          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🌿</div>
          <EyebrowPill text="Nuestra misión" bg="#dbeafe" color="#1d4ed8" />

          <h2 id="mision-heading" style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#0d4f3c', marginBottom: 20, lineHeight: 1.15 }}>
            El conocimiento médico<br />debe ser de todos.
          </h2>

          <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.85, fontStyle: 'italic', maxWidth: 640, margin: '0 auto 12px' }}>
            "Vivimos en un mundo donde la información puede salvar vidas,
            pero pocas personas saben qué hacer en los primeros minutos de una emergencia.
            MediGuard AI existe para cambiar eso."
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: 52 }}>
            — Equipo MediGuard AI, Tecsup 2025
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {[
              { icon: <Shield size={16} />,    text: 'Gratuito para emergencias', bg: '#dbeafe', color: '#1d4ed8' },
              { icon: <Users size={16} />,     text: '+12,000 usuarios activos',  bg: '#dcfce7', color: '#15803d' },
              { icon: <BookOpen size={16} />,  text: '40+ guías validadas',       bg: '#fef3c7', color: '#b45309' },
              { icon: <PhoneCall size={16} />, text: 'SOS en menos de 300ms',     bg: '#fce7f3', color: '#be185d' },
            ].map(b => (
              <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8, background: b.bg, color: b.color, padding: '10px 18px', borderRadius: 50, fontSize: '0.88rem', fontWeight: 600 }}>
                {b.icon} {b.text}
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
