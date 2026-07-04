import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { guideService } from '../services/guideService';
import PageHeader from '../components/ui/PageHeader';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
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
    <div className="page-container">
      <PageHeader
        title={<>Guías de <span className="highlight">Primeros Auxilios</span></>}
        subtitle="Instrucciones interactivas paso a paso para saber cómo responder ante urgencias."
      />

      {isLoading && <Spinner center large label="Cargando guías interactivas…" />}

      {error && <Alert variant="error">{error}</Alert>}

      {!isLoading && !error && guides.length === 0 && (
        <EmptyState emoji="📖" title="Sin guías disponibles">
          No hay guías de primeros auxilios disponibles por ahora.
        </EmptyState>
      )}

      <div className="resource-grid stagger">
        {guides.map((guide) => (
          <article className="resource-card" key={guide.id}>
            <div className="resource-card-icon">
              <ShieldCheck size={22} />
            </div>

            <div className="resource-card-top">
              <span className="tag tag-brand">Paso a Paso</span>
              <span className="resource-card-meta">Offline habilitado</span>
            </div>

            <h3>{guide.title}</h3>

            {guide.description && (
              <p className="resource-card-sub">{guide.description}</p>
            )}

            {guide.content && (
              <p className="resource-card-desc">{guide.content}</p>
            )}

            <div className="resource-card-actions">
              <button type="button" className="btn btn-primary btn-full">
                Iniciar Guía Interactiva
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Guides;
