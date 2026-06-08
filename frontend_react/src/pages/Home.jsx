import { Link } from 'react-router-dom';
import {
  Download, ChevronDown,
  AlertCircle, Activity, BookOpen, MapPin, ShieldCheck,
  Users,
} from 'lucide-react';
import MobileMockup from '../components/MobileMockup';

const FEATURES = [
  { icon: AlertCircle, title: 'SOS Inmediato', desc: 'Alerta a un solo toque que notifica a tus contactos de emergencia preestablecidos y conecta con servicios locales de salud.', emergency: true },
  { icon: Activity, title: 'Triaje Inteligente', desc: 'Sistema de evaluación rápida asistido por IA para clasificar la gravedad de los síntomas y recomendar la mejor acción a seguir.' },
  { icon: BookOpen, title: 'Guías de Primeros Auxilios', desc: 'Biblioteca offline con instrucciones interactivas paso a paso para manejar desde heridas leves hasta RCP.' },
  { icon: MapPin, title: 'Geolocalización Médica', desc: 'Encuentra al instante hospitales, clínicas y farmacias de turno en tu radio más cercano, con rutas optimizadas.' },
  { icon: ShieldCheck, title: 'Prevención y Aprendizaje', desc: 'Módulos educativos, tips de salud y simulacros para estar preparado. Porque la prevención es la mejor medicina.' },
];

const BENEFITS = [
  { emoji: '🛡️', title: 'Seguridad', desc: 'Privacidad absoluta de tus datos médicos.' },
  { emoji: '⚡', title: 'Rapidez', desc: 'Acciones automatizadas en microsegundos.' },
  { emoji: '🌱', title: 'Prevención', desc: 'Enfoque proactivo hacia la salud integral.' },
  { emoji: '🤖', title: 'Tecnología', desc: 'Impulsado por algoritmos de IA modernos.' },
  { emoji: '🌍', title: 'Accesibilidad', desc: 'Diseño inclusivo para cualquier edad.' },
];

const TECH_STACK = ['React JS', 'Node JS', 'React Native', 'Inteligencia Artificial'];

const TEAM = [
  { name: 'Luis Dionicio', role: 'Frontend Developer' },
  { name: 'Rony Quintana', role: 'Mobile Developer' },
  { name: 'Jeronimo Ortiz', role: 'Backend Developer' },
];

function Home() {
  return (
    <main>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text animate-fade-in">
            <div className="badge">
              <span className="badge-pulse" />
              Plataforma Médica Inteligente
            </div>

            <h1>
              Asistencia vital en tu bolsillo con{' '}
              <span className="hero-brand-word">Medi<em>Guard</em> AI</span>
            </h1>

            <p>
              Transforma tu smartphone en una herramienta de respuesta inmediata.
              Prevención proactiva, primeros auxilios interactivos y conexión instantánea
              con servicios de salud.
            </p>

            <div className="hero-buttons">
              <button type="button" className="btn btn-primary btn-hero">
                Descargar App Móvil
                <Download size={18} />
              </button>
              <Link to="/register" className="btn btn-secondary btn-hero">
                Regístrate Ahora
              </Link>
            </div>

            <a href="#features" className="hero-scroll-link">
              Descubre cómo podemos salvar vidas
              <ChevronDown size={18} />
            </a>
          </div>

          <div className="hero-image-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <MobileMockup />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>Seguridad</h3>
            <p>Datos encriptados y protegidos</p>
          </div>
          <div className="stat-item">
            <h3>Rapidez</h3>
            <p>Respuesta en tiempo real</p>
          </div>
          <div className="stat-item">
            <h3>Accesibilidad</h3>
            <p>Diseño intuitivo para todos</p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section" id="features">
        <div className="section-header">
          <h2 className="section-title">Funcionalidades de la Aplicación</h2>
          <p className="section-subtitle">
            MediGuard AI integra tecnología de vanguardia para ofrecer asistencia completa
            antes, durante y después de una emergencia médica.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map(({ icon: Icon, title, desc, emergency }) => (
            <div key={title} className={`feature-card${emergency ? ' emergency' : ''}`}>
              <div className="feature-icon"><Icon size={26} /></div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="benefits-section" id="benefits">
        <div className="benefits-inner">
          <div className="section-header">
            <h2 className="section-title">¿Por qué elegir MediGuard AI?</h2>
            <p className="section-subtitle">
              Nuestro ecosistema tecnológico está fundamentado en cinco pilares clave para protegerte.
            </p>
          </div>
          <div className="benefits-grid">
            {BENEFITS.map(b => (
              <div key={b.title} className="benefit-item">
                <div className="benefit-emoji">{b.emoji}</div>
                <h4 className="benefit-title">{b.title}</h4>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="about-section" id="about">
        <div className="about-grid">
          <div>
            <h2 className="section-title about-section-title">Sobre el Proyecto Académico</h2>
            <p className="about-desc">
              MediGuard AI nace como un <strong>Proyecto Integrador Universitario</strong> con
              un profundo impacto social. Nuestro objetivo es democratizar el acceso a la
              información de salud vital y reducir los tiempos de respuesta en situaciones
              de emergencia.
            </p>
            <div className="about-tech-tags">
              {TECH_STACK.map(t => <span key={t} className="about-tech-tag">{t}</span>)}
            </div>
          </div>

          <div className="about-team-card">
            <h3 className="about-team-title">
              <Users size={22} />
              Equipo Scrum
            </h3>
            <ul className="about-team-list">
              {TEAM.map(m => (
                <li key={m.name} className="about-team-member">
                  <strong className="about-team-name">{m.name}</strong>
                  <span className="about-team-role">{m.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Lleva la seguridad en tu bolsillo</h2>
          <p className="cta-desc">
            No esperes a que ocurra una emergencia. Regístrate en nuestra plataforma web hoy
            mismo y prepárate para descargar la aplicación móvil de MediGuard AI.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-outline-white btn-lg">
              Crear cuenta web gratuita
            </Link>
            <button type="button" className="btn btn-white btn-lg">
              Descargar Aplicación
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
