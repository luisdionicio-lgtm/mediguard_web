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
        setError('No se pudieron cargar las guias de primeros auxilios.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGuides();
  }, []);

  return (
    <div className="simple-page-container">
      <h1 className="section-title">Guías de <span className="highlight">Primeros Auxilios</span></h1>
      <p className="section-subtitle">Instrucciones paso a paso para emergencias.</p>

      {isLoading && (
        <div className="status-message loading">
          <p className="section-subtitle">Cargando guías...</p>
        </div>
      )}
      {error && (
        <div className="status-message error">
          <p className="section-subtitle" style={{ color: '#EF4444' }}>{error}</p>
        </div>
      )}
      {!isLoading && !error && guides.length === 0 && (
        <div className="status-message empty">
          <p className="section-subtitle">No hay guías disponibles.</p>
        </div>
      )}

      <div className="dashboard-grid">
        {guides.map((guide) => (
          <div className="dashboard-card primary" key={guide.id}>
            <div className="card-icon">📖</div>
            <h3>{guide.title}</h3>
            {guide.description && <p><strong>Descripción:</strong> {guide.description}</p>}
            {guide.content && <p>{guide.content}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guides;
