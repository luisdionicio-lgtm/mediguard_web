import { useParams, Link } from 'react-router-dom';
import {
  Play, Clock, BookOpen, AlertTriangle, Lightbulb, ChevronRight,
  ArrowLeft, CheckCircle2, Download, ExternalLink, PhoneCall,
  HeartPulse, ShieldAlert, ShieldCheck, XCircle,
} from 'lucide-react';
import { LEARN_GUIDES, GUIDES_LIST } from '../data/learnGuides';
import '../styles/LearnGuide.css';

const dark   = 'var(--bg)';
const card   = 'var(--surface)';
const border = 'var(--border)';
const muted  = 'var(--text-muted)';
const text   = 'var(--text-primary)';

function StepCard({ number, title, desc, color }) {
  return (
    <div style={{
      display: 'flex', gap: 20, padding: '20px 24px',
      background: card, border: `1px solid ${border}`,
      borderRadius: 14, alignItems: 'flex-start',
    }}>
      <div style={{
        minWidth: 40, height: 40, borderRadius: '50%',
        background: `${color}18`, border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '0.95rem', color, flexShrink: 0,
      }}>
        {number}
      </div>
      <div>
        <p style={{ color: text, fontWeight: 700, fontSize: '0.97rem', marginBottom: 5 }}>{title}</p>
        <p style={{ color: muted, fontSize: '0.88rem', lineHeight: 1.7 }}>{desc}</p>
      </div>
    </div>
  );
}

function WarningBox({ type, text: msg }) {
  const isD = type === 'danger';
  const accent = isD ? '#DC2626' : '#22c55e';
  const Icon   = isD ? AlertTriangle : Lightbulb;
  return (
    <div style={{
      display: 'flex', gap: 14, padding: '14px 18px',
      background: `${accent}0d`, border: `1px solid ${accent}33`,
      borderRadius: 12, alignItems: 'flex-start',
    }}>
      <Icon size={18} color={accent} style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ color: isD ? 'var(--error)' : 'var(--success)', fontSize: '0.88rem', lineHeight: 1.65 }}>{msg}</p>
    </div>
  );
}

function VideoPlaceholder({ color, emoji }) {
  return (
    <div style={{
      aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden',
      background: `linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)`,
      border: `1px solid ${border}`, position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 14,
    }}>
      {/* subtle background emoji */}
      <span style={{ position: 'absolute', fontSize: '8rem', opacity: 0.07, userSelect: 'none' }}>
        {emoji}
      </span>
      {/* play button */}
      <div style={{
        width: 70, height: 70, borderRadius: '50%',
        background: `${color}22`, border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 30px ${color}33`,
      }}>
        <Play size={28} color={color} style={{ marginLeft: 4 }} />
      </div>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p style={{ color: text, fontWeight: 700, fontSize: '0.97rem' }}>Video explicativo</p>
        <p style={{ color: 'var(--text-disabled)', fontSize: '0.8rem', marginTop: 4 }}>Próximamente disponible</p>
      </div>
    </div>
  );
}

function GuideListSection({ title, items, variant, icon: Icon }) {
  return (
    <section className={`offline-guide-section is-${variant}`}>
      <h2><Icon size={22} aria-hidden="true" />{title}</h2>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

function OfflineGuideDetail({ guide }) {
  return (
    <main className="offline-guide-page">
      <header className="offline-guide-hero">
        <div className="offline-guide-shell">
          <Link to="/#recursos" className="offline-guide-back">
            <ArrowLeft size={17} aria-hidden="true" /> Volver a guías
          </Link>
          <span className="offline-guide-category">{guide.category}</span>
          <h1>{guide.title}</h1>
          <p className="offline-guide-summary">{guide.summary}</p>
          <div className="offline-guide-meta">
            <span><Clock size={16} aria-hidden="true" />{guide.estimatedReadTime}</span>
            <span>Revisado: {guide.lastReviewed}</span>
          </div>
        </div>
      </header>

      <div className="offline-guide-shell offline-guide-content">
        <div className="offline-guide-warning" role="alert">
          <ShieldAlert size={24} aria-hidden="true" />
          <p>{guide.emergencyNotice}</p>
        </div>

        <div className="offline-guide-actions">
          <Link to="/emergencies" className="btn btn-emergency">
            <PhoneCall size={17} aria-hidden="true" /> Ver números de emergencia
          </Link>
          {guide.pdfUrl && (
            <a href={guide.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
              <Download size={17} aria-hidden="true" /> Descargar PDF de referencia
            </a>
          )}
        </div>

        <section className="offline-guide-key-idea">
          <Lightbulb size={24} aria-hidden="true" />
          <div>
            <h2>Idea principal</h2>
            <p>{guide.keyIdea}</p>
          </div>
        </section>

        <div className="offline-guide-grid">
          <GuideListSection
            title="Antes de ayudar"
            items={guide.beforeHelping}
            variant="before"
            icon={ShieldCheck}
          />
          <GuideListSection
            title="Señales de alarma"
            items={guide.warningSigns}
            variant="warning"
            icon={AlertTriangle}
          />
          <GuideListSection
            title="Qué hacer"
            items={guide.doSteps}
            variant="do"
            icon={CheckCircle2}
          />
          <GuideListSection
            title="Qué NO hacer"
            items={guide.dontSteps}
            variant="dont"
            icon={XCircle}
          />
          <GuideListSection
            title="Cuándo pedir ayuda urgente"
            items={guide.callEmergencyWhen}
            variant="urgent"
            icon={PhoneCall}
          />
          <GuideListSection
            title="Después de ayudar"
            items={guide.afterCare}
            variant="after"
            icon={HeartPulse}
          />
        </div>

        <aside className="offline-guide-disclaimer">
          <strong>Alcance de esta guía:</strong> {guide.disclaimer}
        </aside>

        <section className="offline-guide-source">
          <h2>Fuente de referencia</h2>
          <p>Contenido breve y original elaborado con fines educativos a partir de:</p>
          <a href={guide.sourceUrl} target="_blank" rel="noreferrer">
            {guide.sourceName} <ExternalLink size={14} aria-hidden="true" />
          </a>
        </section>

        <Link to="/#recursos" className="offline-guide-back is-bottom">
          <ArrowLeft size={17} aria-hidden="true" /> Volver a guías
        </Link>
      </div>
    </main>
  );
}

export default function LearnGuide() {
  const { slug } = useParams();
  const guide = LEARN_GUIDES[slug];

  if (!guide) {
    return (
      <div style={{ minHeight: '100vh', background: dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontSize: '4rem' }}>🔍</span>
        <p style={{ color: muted, fontSize: '1.1rem' }}>Guía no encontrada.</p>
        <Link to="/" style={{ color: 'var(--success)', textDecoration: 'none', fontWeight: 600 }}>← Volver al inicio</Link>
      </div>
    );
  }

  if (guide.kind === 'offline-first-aid') {
    return <OfflineGuideDetail guide={guide} />;
  }

  const { color, emoji, tag, badge, title, duration, videoEmbed, intro, steps, extraNote, warnings } = guide;
  const related = GUIDES_LIST.filter(g => g.slug !== slug);

  return (
    <div style={{ minHeight: '100vh', background: dark, color: text }}>

      {/* ── HERO ── */}
      <div style={{ background: `linear-gradient(180deg, var(--surface) 0%, ${dark} 100%)`, borderBottom: `1px solid ${border}`, padding: '40px 24px 36px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: muted, fontSize: '0.82rem', marginBottom: 24 }}>
            <Link to="/" style={{ color: muted, textDecoration: 'none' }}>Inicio</Link>
            <ChevronRight size={13} />
            <span style={{ color: text }}>Aprende antes de necesitarlo</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center' }}>
            <span style={{ background: `${color}20`, color, border: `1px solid ${color}40`, borderRadius: 6, padding: '3px 12px', fontSize: '0.78rem', fontWeight: 700 }}>{badge}</span>
            <span style={{ background: border, color: muted, borderRadius: 6, padding: '3px 12px', fontSize: '0.78rem', fontWeight: 600 }}>{tag}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2.1rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 14, color: text }}>
            <span style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', marginRight: 12 }}>{emoji}</span>
            {title}
          </h1>

          <p style={{ color: muted, lineHeight: 1.7, fontSize: '0.97rem', maxWidth: 680, marginBottom: 20 }}>{intro}</p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.83rem' }}>
              <Clock size={14} /> {duration}
            </span>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.83rem' }}>
              <BookOpen size={14} /> {steps.length} pasos
            </span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Video + quick card row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 48 }} className="lg-two-col">
          <style>{`@media(min-width:700px){.lg-two-col{grid-template-columns:1fr 260px!important;}}`}</style>

          {/* Video */}
          {videoEmbed ? (
            <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9' }}>
              <iframe
                src={videoEmbed}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
              />
            </div>
          ) : (
            <VideoPlaceholder color={color} emoji={emoji} />
          )}

          {/* Quick info */}
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: 14 }}>
              <p style={{ color: muted, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>En este artículo</p>
              {steps.map((s, i) => (
                <p key={i} style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '3px 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color, fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span> {s.title}
                </p>
              ))}
            </div>
            <div>
              <p style={{ color: muted, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Categoría</p>
              <span style={{ background: `${color}18`, color, borderRadius: 8, padding: '5px 14px', fontSize: '0.82rem', fontWeight: 700 }}>{tag}</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: text, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 22, background: color, borderRadius: 4, display: 'inline-block' }} />
            Pasos a seguir
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((s, i) => (
              <StepCard key={i} number={i + 1} title={s.title} desc={s.desc} color={color} />
            ))}
          </div>
        </div>

        {/* Extra note */}
        {extraNote && (
          <div style={{ background: `${color}0a`, border: `1px solid ${color}30`, borderRadius: 16, padding: 24, marginBottom: 48 }}>
            <h3 style={{ color: text, fontWeight: 700, fontSize: '1rem', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.1rem' }}>ℹ️</span> {extraNote.title}
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none' }}>
              {extraNote.items.map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, color: muted, fontSize: '0.88rem', lineHeight: 1.6 }}>
                  <span style={{ color, flexShrink: 0, fontWeight: 800 }}>→</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: text, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 4, height: 22, background: 'var(--error)', borderRadius: 4, display: 'inline-block' }} />
            Avisos importantes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {warnings.map((w, i) => <WarningBox key={i} type={w.type} text={w.text} />)}
          </div>
        </div>

        {/* Related guides */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: text, marginBottom: 18 }}>Más guías gratuitas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
            {related.map(g => (
              <Link key={g.slug} to={`/aprende/${g.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: card, border: `1px solid ${border}`, borderRadius: 14, padding: '18px 20px',
                  display: 'flex', gap: 14, alignItems: 'center',
                  transition: 'border-color 0.2s, transform 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = g.color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{g.emoji}</span>
                  <div>
                    <p style={{ color: text, fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.3, marginBottom: 4 }}>{g.title}</p>
                    <p style={{ color: 'var(--text-disabled)', fontSize: '0.77rem' }}>{g.duration}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
