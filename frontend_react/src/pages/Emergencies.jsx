import { useEffect, useState } from 'react';
import { emergencyService } from '../services/emergencyService';
import { getApiErrorMessage } from '../services/errorService';
import '../styles/Dashboard.css';

const getCurrentPosition = () => new Promise((resolve) => {
  if (!navigator.geolocation) {
    resolve({});
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => resolve({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }),
    () => resolve({}),
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
  );
});

const Emergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sosLoading, setSosLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState('');
  const [sosError, setSosError] = useState('');

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

  const handleCreateSos = async () => {
    setSosMessage('');
    setSosError('');
    setSosLoading(true);

    try {
      const position = await getCurrentPosition();
      await emergencyService.createSosEvent({
        status: 'activado',
        device: navigator.userAgent.slice(0, 100),
        notes: 'SOS activado desde la web',
        notified_contacts: 0,
        ...position,
      });
      setSosMessage('Evento SOS registrado correctamente.');
    } catch (err) {
      setSosError(getApiErrorMessage(err, 'No se pudo registrar el evento SOS.'));
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <div className="simple-page-container">
      <div className="dashboard-header animate-fade-in" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">
          Contactos de <span className="highlight" style={{ color: 'var(--red-emergency)' }}>Emergencia</span>
        </h1>
        <p className="section-subtitle">Líneas de ayuda crítica y servicios vitales disponibles las 24 horas.</p>
        <div style={{ marginTop: '1.5rem', display: 'grid', justifyItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-emergency"
            onClick={handleCreateSos}
            disabled={sosLoading}
            style={{ padding: '0.9rem 1.5rem', fontWeight: 800 }}
          >
            {sosLoading ? 'Registrando SOS...' : 'Activar SOS'}
          </button>
          {(sosMessage || sosError) && (
            <p className="section-subtitle" style={{ color: sosError ? '#EF4444' : 'var(--teal-primary)', margin: 0 }}>
              {sosError || sosMessage}
            </p>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="status-message loading animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <svg className="badge-pulse" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--red-emergency)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
          <p className="section-subtitle" style={{ marginTop: '10px' }}>Cargando directorio de emergencia...</p>
        </div>
      )}
      
      {error && (
        <div className="status-message error animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-subtitle" style={{ color: '#EF4444' }}>{error}</p>
        </div>
      )}

      {!isLoading && !error && emergencies.length === 0 && (
        <div className="status-message empty animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-subtitle">No hay contactos de emergencia disponibles actualmente.</p>
        </div>
      )}

      <div className="dashboard-premium-grid">
        {emergencies.map((emergency, index) => (
          <div 
            className="premium-card animate-fade-in" 
            key={emergency.id} 
            style={{ 
              animationDelay: `${0.1 * (index + 1)}s`,
              borderTop: '6px solid var(--red-emergency)'
            }}
          >
            <div className="premium-card-content" style={{ padding: '2rem 1.5rem 1.5rem' }}>
              <div className="card-icon-wrapper" style={{ top: '-28px', backgroundColor: 'var(--red-light)', color: 'var(--red-emergency)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="badge-pulse">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="card-badge" style={{ backgroundColor: 'var(--red-light)', color: 'var(--red-hover)', padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>
                  24/7 Disponible
                </span>
                <span className="badge-pulse" style={{ width: '10px', height: '10px', backgroundColor: 'var(--red-emergency)', borderRadius: '50%' }}></span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--blue-deep)', fontWeight: '700', marginBottom: '0.5rem' }}>
                {emergency.name}
              </h3>
              
              {emergency.serviceType && (
                <p style={{ color: 'var(--teal-primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {emergency.serviceType}
                </p>
              )}

              {emergency.description && (
                <p style={{ color: 'var(--blue-light)', fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: '1.5', flexGrow: 1 }}>
                  {emergency.description}
                </p>
              )}

              <div className="premium-card-actions" style={{ marginTop: 'auto' }}>
                <a 
                  href={`tel:${emergency.phone}`} 
                  className="btn btn-emergency btn-full"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92z"></path></svg>
                  Llamar {emergency.phone}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emergencies;
