import { useEffect, useState } from 'react';
import { guideService } from '../services/guideService';
import '../styles/Dashboard.css';

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const data = await guideService.getAll();
        setGuides(data);
      } catch {
        setError('No se pudieron cargar las guías de primeros auxilios.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGuides();
  }, []);

  return (
    <div className="simple-page-container animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">
          Guías de <span className="highlight">Primeros Auxilios</span>
        </h1>
        <p className="section-subtitle">Instrucciones interactivas paso a paso para saber cómo responder ante urgencias.</p>
      </div>

      {isLoading && (
        <div className="status-message loading animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <svg className="badge-pulse" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
          <p className="section-subtitle" style={{ marginTop: '10px' }}>Cargando guías interactivas...</p>
        </div>
      )}
      
      {error && (
        <div className="status-message error animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-subtitle" style={{ color: '#EF4444' }}>{error}</p>
        </div>
      )}

      {!isLoading && !error && guides.length === 0 && (
        <div className="status-message empty animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-subtitle">No hay guías de primeros auxilios disponibles.</p>
        </div>
      )}

      <div className="dashboard-premium-grid">
        {guides.map((guide, index) => (
          <div 
            className="premium-card animate-fade-in" 
            key={guide.id}
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="premium-card-content" style={{ padding: '2rem 1.5rem 1.5rem' }}>
              <div className="card-icon-wrapper text-primary" style={{ top: '-28px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="card-badge bg-primary">
                  Paso a Paso
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--blue-light)', fontWeight: '600' }}>Offline habilitado</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--blue-deep)', fontWeight: '700', marginBottom: '0.75rem' }}>
                {guide.title}
              </h3>
              
              {guide.description && (
                <p style={{ color: 'var(--blue-mid)', fontWeight: '600', fontSize: '0.925rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                  {guide.description}
                </p>
              )}

              {guide.content && (
                <p style={{ color: 'var(--blue-light)', fontSize: '0.925rem', marginBottom: '1.5rem', lineHeight: '1.6', flexGrow: 1 }}>
                  {guide.content}
                </p>
              )}

              <div className="premium-card-actions" style={{ marginTop: 'auto' }}>
                <button className="btn btn-primary btn-full" style={{ padding: '0.6rem' }}>
                  Iniciar Guía Interactiva
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guides;
