import { Link } from 'react-router-dom';
import MobileMockup from '../components/MobileMockup';

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text animate-fade-in">
            <div className="badge">
              <span className="badge-pulse"></span>
              Plataforma Médica Inteligente
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1' }}>
              Asistencia vital en tu bolsillo con <span style={{ background: 'linear-gradient(135deg, var(--teal-primary), var(--blue-deep))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediGuard AI</span>
            </h1>
            <p style={{ fontSize: '1.35rem', color: 'var(--blue-light)', marginTop: '1.5rem', marginBottom: '2.5rem', maxWidth: '600px' }}>
              Transforma tu smartphone en una herramienta de respuesta inmediata. Prevención proactiva, primeros auxilios interactivos y conexión instantánea con servicios de salud.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: 'var(--radius-lg)' }}>
                Descargar App Móvil
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem', borderRadius: 'var(--radius-lg)' }}>
                Regístrate Ahora
              </Link>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <a href="#features" style={{ fontSize: '1rem', color: 'var(--teal-primary)', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'var(--transition)' }}>
                Descubre cómo podemos salvar vidas
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </a>
            </div>
          </div>

          <div className="hero-image-container animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <MobileMockup />
          </div>
        </div>
      </section>

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

      <section className="section" id="features">
        <div className="section-header">
          <h2 className="section-title">Funcionalidades de la Aplicación</h2>
          <p className="section-subtitle">
            MediGuard AI integra tecnología de vanguardia para ofrecer asistencia completa
            antes, durante y después de una emergencia médica.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card emergency">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
            </div>
            <h3 className="feature-title">SOS Inmediato</h3>
            <p className="feature-desc">Alerta a un solo toque que notifica a tus contactos de emergencia preestablecidos y conecta con servicios locales de salud.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="feature-title">Triaje Inteligente</h3>
            <p className="feature-desc">Sistema de evaluación rápida asistido por IA para clasificar la gravedad de los síntomas y recomendar la mejor acción a seguir.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 className="feature-title">Guías de Primeros Auxilios</h3>
            <p className="feature-desc">Biblioteca offline con instrucciones interactivas paso a paso para manejar desde heridas leves hasta RCP.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h3 className="feature-title">Geolocalización Médica</h3>
            <p className="feature-desc">Encuentra al instante hospitales, clínicas y farmacias de turno en tu radio más cercano, con rutas optimizadas.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Prevención y Aprendizaje</h3>
            <p className="feature-desc">Módulos educativos, tips de salud y simulacros para estar preparado. Porque la prevención es la mejor medicina.</p>
          </div>
        </div>
      </section>

      <section className="section" id="benefits" style={{ backgroundColor: 'var(--white)' }}>
        <div className="section-header">
          <h2 className="section-title">¿Por qué elegir MediGuard AI?</h2>
          <p className="section-subtitle">
            Nuestro ecosistema tecnológico está fundamentado en cinco pilares clave para protegerte.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--blue-deep)' }}>Seguridad</h4>
            <p style={{ color: 'var(--blue-light)' }}>Privacidad absoluta de tus datos médicos.</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--blue-deep)' }}>Rapidez</h4>
            <p style={{ color: 'var(--blue-light)' }}>Acciones automatizadas en microsegundos.</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌱</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--blue-deep)' }}>Prevención</h4>
            <p style={{ color: 'var(--blue-light)' }}>Enfoque proactivo hacia la salud integral.</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤖</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--blue-deep)' }}>Tecnología</h4>
            <p style={{ color: 'var(--blue-light)' }}>Impulsado por algoritmos de IA modernos.</p>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌍</div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--blue-deep)' }}>Accesibilidad</h4>
            <p style={{ color: 'var(--blue-light)' }}>Diseño inclusivo para cualquier edad.</p>
          </div>
        </div>
      </section>

      <section className="section" id="about" style={{ backgroundColor: 'var(--teal-surface)', borderRadius: 'var(--radius-xl)', margin: '4rem 5%', padding: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem', fontSize: '2rem' }}>Sobre el Proyecto Académico</h2>
            <p style={{ color: 'var(--blue-light)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
              MediGuard AI nace como un <strong>Proyecto Integrador Universitario</strong> con un profundo impacto social.
              Nuestro objetivo es democratizar el acceso a la información de salud vital y reducir los tiempos de respuesta en situaciones de emergencia.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              <span style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--teal-dark)', border: '1px solid var(--teal-light)' }}>React JS</span>
              <span style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--teal-dark)', border: '1px solid var(--teal-light)' }}>Node JS</span>
              <span style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--teal-dark)', border: '1px solid var(--teal-light)' }}>React Native</span>
              <span style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--teal-dark)', border: '1px solid var(--teal-light)' }}>Inteligencia Artificial</span>
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--blue-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Equipo Scrum
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--blue-mid)' }}>Luis Dionicio</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--teal-primary)', backgroundColor: 'var(--teal-light)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>Frontend Developer</span>
              </li>
              <li style={{ padding: '1rem 0', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--blue-mid)' }}>Rony Quintana</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--teal-primary)', backgroundColor: 'var(--teal-light)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>Mobile Developer</span>
              </li>
              <li style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'var(--blue-mid)' }}>Jeronimo Ortiz</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--teal-primary)', backgroundColor: 'var(--teal-light)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>Backend Developer</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Lleva la seguridad en tu bolsillo</h2>
          <p className="cta-desc">
            No esperes a que ocurra una emergencia. Regístrate en nuestra plataforma web hoy mismo
            y prepárate para descargar la aplicación móvil de MediGuard AI.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-outline-white btn-lg" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Crear cuenta web gratuita
            </Link>
            <button className="btn btn-white btn-lg" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
              Descargar Aplicación
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
