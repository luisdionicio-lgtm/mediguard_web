import { useEffect, useState } from 'react';
import { emergencyService } from '../services/emergencyService';
import '../styles/Dashboard.css';

const Emergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEmergencies = async () => {
      try {
        const data = await emergencyService.getAll();
        setEmergencies(data);
      } catch {
        setError('No se pudieron cargar los contactos de emergencia.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmergencies();
  }, []);

  return (
    <div className="simple-page-container">
      <h1 className="section-title">Contactos de <span className="highlight">Emergencia</span></h1>
      <p className="section-subtitle">Números y recursos vitales en caso de urgencia.</p>

      {isLoading && (
        <div className="status-message loading">
          <p className="section-subtitle">Cargando emergencias...</p>
        </div>
      )}
      {error && (
        <div className="status-message error">
          <p className="section-subtitle" style={{ color: '#EF4444' }}>{error}</p>
        </div>
      )}
      {!isLoading && !error && emergencies.length === 0 && (
        <div className="status-message empty">
          <p className="section-subtitle">No hay contactos de emergencia disponibles.</p>
        </div>
      )}

      <div className="dashboard-grid">
        {emergencies.map((emergency) => (
          <div className="dashboard-card dark" key={emergency.id}>
            <div className="card-icon">🚨</div>
            <h3>{emergency.name}</h3>
            <p><strong>Teléfono:</strong> <span style={{ color: '#EF4444', fontSize: '1.2rem', fontWeight: 'bold' }}>{emergency.phone}</span></p>
            {emergency.serviceType && <p><strong>Servicio:</strong> {emergency.serviceType}</p>}
            {emergency.description && <p>{emergency.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emergencies;
