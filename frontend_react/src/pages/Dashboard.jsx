import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Newspaper, MapPin, ArrowRight, ChevronRight,
  Heart, Droplets, Flame, Play, Award, Activity, Shield, Clock,
} from 'lucide-react';
import { useCategories } from '../hooks/useCourse';
import { useGuides } from '../hooks/useGuides';
import { guideImage } from '../utils/guideImages';
import '../styles/Dashboard.css';

/* ── Accesos rápidos ─────────────────────────────── */
const QUICK_LINKS = [
  { to: '/guides',    Icon: BookOpen,  cls: 'ql-brand',  title: 'Biblioteca de Guías',
    desc: 'Guías médicas verificadas por especialistas, paso a paso.' },
  { to: '/news',      Icon: Newspaper, cls: 'ql-sky',    title: 'Noticias y Prevención',
    desc: 'Actualidad en salud pública y estrategias de prevención.' },
  { to: '/hospitals', Icon: MapPin,    cls: 'ql-violet', title: 'Centros Médicos',
    desc: 'Localiza el servicio de emergencias más cercano a ti.' },
];

/* Acento visual por guía (fotos/progreso del Figma eran demo; aquí
   derivamos el acento de la categoría real, con respaldo por índice). */
const GUIDE_ACCENTS = [
  { cls: 'gd-red',   Icon: Heart },
  { cls: 'gd-rose',  Icon: Droplets },
  { cls: 'gd-amber', Icon: Flame },
];
const CATEGORY_ACCENT = {
  'primeros-auxilios': 0, heridas: 1, quemaduras: 2, traumatismos: 1, pediatria: 0,
};

const Dashboard = () => {
  const [userName] = useState(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const u = JSON.parse(localUser);
        return u.first_name || u.nombre?.split(' ')[0] || 'Usuario';
      } catch { /* silencio */ }
    }
    return 'Usuario';
  });

  const { data: categories = [] } = useCategories();
  const { data: allGuides = [], isLoading: loadingGuides } = useGuides();

  const guides = Array.isArray(allGuides) ? allGuides.slice(0, 3) : [];

  const HERO_STATS = [
    { value: `${allGuides.length || 0}`, label: 'Guías disponibles' },
    { value: `${categories.length || 0}`, label: 'Categorías' },
    { value: '24/7', label: 'Acceso offline' },
  ];

  return (
    <div className="page-container">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="dash2-hero">
        <div className="dash2-hero-blobs" aria-hidden="true">
          <span className="dash2-blob dash2-blob-1" />
          <span className="dash2-blob dash2-blob-2" />
          <span className="dash2-blob dash2-blob-3" />
        </div>

        <div className="dash2-hero-inner">
          <div className="dash2-hero-copy">
            <span className="dash2-hero-badge">
              <span className="dash2-hero-badge-dot" />
              Bienvenido de vuelta, {userName}
            </span>

            <h1 className="dash2-hero-title">
              Tu academia de<br />
              <span className="dash2-hero-title-soft">primeros auxilios</span><br />
              está aquí para ti
            </h1>

            <p className="dash2-hero-sub">
              Aprende a salvar vidas con cursos interactivos. Desarrolla habilidades
              críticas y prepárate para responder ante cualquier emergencia con confianza.
            </p>

            <div className="dash2-hero-actions">
              <Link to="/courses" className="dash2-btn-solid">
                Explorar catálogo de cursos
                <ArrowRight size={16} strokeWidth={2.5} className="dash2-btn-arrow" />
              </Link>
              <Link to="/guides" className="dash2-btn-ghost">
                <Play size={15} fill="currentColor" strokeWidth={0} />
                Ver guías
              </Link>
            </div>

            <div className="dash2-hero-stats">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="dash2-hero-stat">
                  <div className="dash2-hero-stat-val">{s.value}</div>
                  <div className="dash2-hero-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen + badges flotantes (solo desktop) */}
          <div className="dash2-hero-media">
            <div className="dash2-hero-media-glow" aria-hidden="true" />
            <img
              className="dash2-hero-img"
              src="https://images.unsplash.com/photo-1781552037019-190ffbd94751?w=680&h=480&fit=crop&auto=format"
              alt="Equipo practicando maniobras de reanimación en entrenamiento de primeros auxilios"
            />
            <div className="dash2-float dash2-float-br">
              <div className="dash2-float-icon dash2-float-icon-brand"><Award size={18} /></div>
              <div>
                <div className="dash2-float-title">Certificado oficial</div>
                <div className="dash2-float-sub">Al completar el curso</div>
              </div>
            </div>
            <div className="dash2-float dash2-float-tr">
              <div className="dash2-float-icon dash2-float-icon-red"><Heart size={18} fill="currentColor" strokeWidth={0} /></div>
              <div>
                <div className="dash2-float-title">Salva vidas</div>
                <div className="dash2-float-sub">Con total confianza</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Acceso rápido ─────────────────────────────── */}
      <section className="dash2-section">
        <div className="dash2-section-head">
          <div>
            <h2 className="dash2-section-title">Acceso rápido</h2>
            <p className="dash2-section-sub">Navega directamente a los recursos más importantes.</p>
          </div>
        </div>

        <div className="dash2-quick-grid stagger">
          {QUICK_LINKS.map((ql) => (
            <Link key={ql.to} to={ql.to} className={`dash2-quick-card ${ql.cls}`}>
              <span className="dash2-quick-icon"><ql.Icon size={22} strokeWidth={1.75} /></span>
              <h3 className="dash2-quick-title">{ql.title}</h3>
              <p className="dash2-quick-desc">{ql.desc}</p>
              <span className="dash2-quick-cta">Abrir recurso <ChevronRight size={15} strokeWidth={2.5} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Guías de Primeros Auxilios ───────────────── */}
      <section className="dash2-section">
        <div className="dash2-section-head">
          <div>
            <h2 className="dash2-section-title">Guías de Primeros Auxilios</h2>
            <p className="dash2-section-sub">Protocolos revisados por profesionales médicos certificados.</p>
          </div>
          <Link to="/guides" className="dash2-section-link">
            Ver todas <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </div>

        {loadingGuides && <p className="dash2-muted">Cargando guías…</p>}

        {!loadingGuides && guides.length === 0 && (
          <p className="dash2-muted">
            No hay guías disponibles aún.{' '}
            <Link to="/guides" style={{ color: 'var(--brand)', fontWeight: 700 }}>Ir a guías</Link>
          </p>
        )}

        {!loadingGuides && guides.length > 0 && (
          <div className="dash2-guides-grid stagger">
            {guides.map((guide, i) => {
              const accent = GUIDE_ACCENTS[CATEGORY_ACCENT[guide.category] ?? i % GUIDE_ACCENTS.length];
              const img = guideImage(guide);
              return (
                <Link to="/guides" key={guide.id} className="dash2-guide-card">
                  <div className={`dash2-guide-media ${accent.cls}`}>
                    {img && (
                      <img
                        className="dash2-guide-img"
                        src={img}
                        alt={guide.title}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    <span className="dash2-guide-cat">{guide.category || 'Guía'}</span>
                    <span className="dash2-guide-badge"><accent.Icon size={20} /></span>
                  </div>
                  <div className="dash2-guide-body">
                    <div className="dash2-guide-tags">
                      <span className="dash2-tag dash2-tag-brand">Paso a paso</span>
                      <span className="dash2-tag-meta"><Clock size={13} strokeWidth={2} /> Offline</span>
                    </div>
                    <h3 className="dash2-guide-title">{guide.title}</h3>
                    {(guide.description || guide.content) && (
                      <p className="dash2-guide-desc">{guide.description || guide.content}</p>
                    )}
                    <span className="dash2-guide-cta">
                      Comenzar guía
                      <ChevronRight size={15} strokeWidth={2.5} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Banner motivacional ──────────────────────── */}
      <section className="dash2-banner">
        <span className="dash2-banner-blob" aria-hidden="true" />
        <div className="dash2-banner-icon"><Activity size={26} strokeWidth={2} /></div>
        <div className="dash2-banner-text">
          <h3 className="dash2-banner-title">¡Sigue avanzando, {userName}!</h3>
          <p className="dash2-banner-sub">
            Tienes <span className="dash2-banner-hl">{allGuides.length}</span> guías listas para explorar.
            Sigue practicando para dominar tus habilidades de primeros auxilios.
          </p>
        </div>
        <Link to="/guides" className="dash2-banner-cta">
          Continuar aprendiendo
          <ArrowRight size={16} strokeWidth={2.5} />
        </Link>
      </section>
    </div>
  );
};

export default Dashboard;
