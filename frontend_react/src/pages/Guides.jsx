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

      {isLoading && <p className="section-subtitle">Cargando guias...</p>}
      {error && <p className="section-subtitle">{error}</p>}
      {!isLoading && !error && guides.length === 0 && (
        <p className="section-subtitle">No hay guias disponibles.</p>
      )}

      <div className="dashboard-grid">
        {guides.map((guide) => (
          <div className="dashboard-card primary" key={guide.id}>
            <h3>{guide.title}</h3>
            <p>{guide.description}</p>
            <p>{guide.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guides;
