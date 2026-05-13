import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container page-container">
      <div className="dashboard-header">
        <h1 className="section-title">Tu Dashboard <span className="highlight">Médico</span></h1>
        <p className="section-subtitle">Acceso rápido a herramientas de emergencia y primeros auxilios</p>
      </div>

      <div className="dashboard-grid">
        <Link to="/guides" className="dashboard-card primary">
          <div className="card-icon">📚</div>
          <h3>Guías de Primeros Auxilios</h3>
          <p>Aprende cómo actuar ante emergencias como RCP, quemaduras, hemorragias y más.</p>
        </Link>
        
        <Link to="/hospitals" className="dashboard-card secondary">
          <div className="card-icon">🏥</div>
          <h3>Centros Médicos Cercanos</h3>
          <p>Encuentra hospitales y clínicas cercanos a tu ubicación en tiempo real.</p>
        </Link>

        <Link to="/news" className="dashboard-card">
          <div className="card-icon">📰</div>
          <h3>Noticias de Salud</h3>
          <p>Mantente informado sobre las últimas alertas médicas y noticias de salud pública.</p>
        </Link>

        <Link to="/profile" className="dashboard-card dark">
          <div className="card-icon">👤</div>
          <h3>Mi Perfil</h3>
          <p>Administra tu información personal y contactos de emergencia para acceso rápido.</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
