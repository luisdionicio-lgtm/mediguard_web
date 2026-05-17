import { useEffect, useState } from 'react';
import { hospitalService } from '../services/hospitalService';
import '../styles/Dashboard.css';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const data = await hospitalService.getAll();
        setHospitals(data);
      } catch {
        setError('No se pudieron cargar los centros médicos.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHospitals();
  }, []);

  return (
    <div className="simple-page-container animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Centros <span className="highlight">Médicos</span></h1>
        <p className="section-subtitle">Red nacional de hospitales, clínicas y centros de trauma más cercanos a ti.</p>
      </div>

      {isLoading && (
        <div className="status-message loading animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <svg className="badge-pulse" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--teal-dark)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
          <p className="section-subtitle" style={{ marginTop: '10px' }}>Localizando centros médicos...</p>
        </div>
      )}
      
      {error && (
        <div className="status-message error animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-subtitle" style={{ color: '#EF4444' }}>{error}</p>
        </div>
      )}

      {!isLoading && !error && hospitals.length === 0 && (
        <div className="status-message empty animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-subtitle">No hay centros médicos disponibles.</p>
        </div>
      )}

      <div className="dashboard-premium-grid">
        {hospitals.map((hospital, index) => (
          <div 
            className="premium-card animate-fade-in" 
            key={hospital.id}
            style={{ 
              animationDelay: `${0.1 * (index + 1)}s`,
              borderTop: '6px solid var(--teal-dark)'
            }}
          >
            <div className="premium-card-content" style={{ padding: '2rem 1.5rem 1.5rem' }}>
              <div className="card-icon-wrapper text-secondary" style={{ top: '-28px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"></path><path d="M12 7v6"></path><path d="M9 10h6"></path></svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="card-badge bg-secondary">
                  Servicio Público / Privado
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--teal-dark)', fontWeight: '700' }}>Abierto</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--blue-deep)', fontWeight: '700', marginBottom: '1rem' }}>
                {hospital.name}
              </h3>
              
              <ul className="info-list" style={{ marginBottom: '1.5rem', listStyle: 'none', padding: 0 }}>
                {hospital.address && (
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--blue-light)', fontWeight: '600' }}>Dirección:</span>
                    <span style={{ color: 'var(--blue-mid)', fontWeight: '700', textAlign: 'right' }}>{hospital.address}</span>
                  </li>
                )}
                {hospital.phone && (
                  <li style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--blue-light)', fontWeight: '600' }}>Contacto:</span>
                    <span style={{ color: 'var(--blue-mid)', fontWeight: '700' }}>{hospital.phone}</span>
                  </li>
                )}
                {hospital.latitude && hospital.longitude && (
                  <li style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--blue-light)', fontWeight: '600' }}>Coordenadas:</span>
                    <span style={{ color: 'var(--blue-mid)', fontWeight: '700' }}>{hospital.latitude}, {hospital.longitude}</span>
                  </li>
                )}
              </ul>

              <div className="premium-card-actions" style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                {hospital.phone && (
                  <a href={`tel:${hospital.phone}`} className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem' }}>
                    Llamar
                  </a>
                )}
                <button className="btn btn-primary" style={{ flex: 2, padding: '0.6rem' }}>
                  Cómo Llegar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
