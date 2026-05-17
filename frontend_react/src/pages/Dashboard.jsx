import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container page-container">
      <div className="dashboard-header animate-fade-in">
        <h1 className="section-title">Tu Dashboard <span className="highlight">Médico</span></h1>
        <p className="section-subtitle">Acceso rápido a herramientas de emergencia y primeros auxilios de nivel profesional</p>
      </div>

      <div className="dashboard-premium-grid">
        {/* Card 1: Guides */}
        <div className="premium-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="premium-card-image">
            <img src="/images/first_aid_guides.png" alt="Guías de Primeros Auxilios" />
            <div className="premium-card-overlay">
              <span className="card-badge bg-primary">Esencial</span>
            </div>
          </div>
          <div className="premium-card-content">
            <div className="card-icon-wrapper text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path><path d="M12 8v6"></path><path d="M9 11h6"></path></svg>
            </div>
            <h3>Primeros Auxilios</h3>
            <p>Aprende cómo actuar ante emergencias médicas vitales como RCP, quemaduras severas, y control de hemorragias.</p>
            <div className="premium-card-actions">
              <Link to="/guides" className="btn btn-primary btn-full">Acceder a Guías</Link>
            </div>
          </div>
        </div>
        
        {/* Card 2: Hospitals */}
        <div className="premium-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="premium-card-image">
            <img src="/images/nearby_hospitals.png" alt="Centros Médicos Cercanos" />
            <div className="premium-card-overlay">
              <span className="card-badge bg-secondary">Geolocalización</span>
            </div>
          </div>
          <div className="premium-card-content">
            <div className="card-icon-wrapper text-secondary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M12 7v6"></path><path d="M9 10h6"></path></svg>
            </div>
            <h3>Centros Médicos Cercanos</h3>
            <p>Encuentra de manera rápida hospitales, clínicas y centros de trauma más cercanos a tu ubicación en tiempo real.</p>
            <div className="premium-card-actions">
              <Link to="/hospitals" className="btn btn-secondary btn-full">Consultar Mapa</Link>
            </div>
          </div>
        </div>

        {/* Card 3: News */}
        <div className="premium-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="premium-card-image">
            <img src="/images/health_news.png" alt="Noticias de Salud" />
            <div className="premium-card-overlay">
              <span className="card-badge bg-dark">Actualidad</span>
            </div>
          </div>
          <div className="premium-card-content">
            <div className="card-icon-wrapper text-dark">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path></svg>
            </div>
            <h3>Noticias de Salud</h3>
            <p>Mantente informado sobre alertas epidemiológicas, nuevas investigaciones y recomendaciones de salud pública.</p>
            <div className="premium-card-actions">
              <Link to="/news" className="btn btn-outline-dark btn-full">Ver Noticias</Link>
            </div>
          </div>
        </div>

        {/* Card 4: Profile */}
        <div className="premium-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="premium-card-image">
            <img src="/images/health_profile.png" alt="Mi Perfil Médico" />
            <div className="premium-card-overlay">
              <span className="card-badge bg-primary">Privado</span>
            </div>
          </div>
          <div className="premium-card-content">
            <div className="card-icon-wrapper text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <h3>Mi Perfil Médico</h3>
            <p>Administra tu información médica confidencial, contactos de emergencia y parámetros vitales base de forma segura.</p>
            <div className="premium-card-actions">
              <Link to="/profile" className="btn btn-primary btn-full">Gestionar Perfil</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
