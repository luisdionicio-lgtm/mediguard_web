import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { guideService } from '../services/guideService';
import { authService } from '../services/authService';
import PageHeader from '../components/ui/PageHeader';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import '../styles/Dashboard.css';

const FREE_PREVIEW_LIMIT = 3;

const Guides = () => {
  const [allGuides, setAllGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isAuthenticated = !!authService.getCurrentUser();

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const data = await guideService.getAll();
        setAllGuides(data);
      } catch {
        setError('No se pudieron cargar las guías de primeros auxilios.');
      } finally {
        setIsLoading(false);
      }
    };

    loadGuides();
  }, []);

  const guides = isAuthenticated ? allGuides : allGuides.slice(0, FREE_PREVIEW_LIMIT);
  const lockedCount = isAuthenticated ? 0 : Math.max(0, allGuides.length - FREE_PREVIEW_LIMIT);

  return (
    <div className="page-container">
      <PageHeader
        title={<>Guías de <span className="highlight">Primeros Auxilios</span></>}
        subtitle="Instrucciones interactivas paso a paso para saber cómo responder ante urgencias."
      />

      {isLoading && <Spinner center large label="Cargando guías interactivas…" />}

      {error && <Alert variant="error">{error}</Alert>}

      {!isLoading && !error && allGuides.length === 0 && (
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

      {/* Banner de acceso bloqueado */}
      {!isAuthenticated && lockedCount > 0 && (
        <div style={{ margin: '32px auto', maxWidth: 520, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px 24px', textAlign: 'center' }}>
          <Lock size={32} style={{ color: 'var(--brand)', marginBottom: 12 }} />
          <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            {lockedCount} guía{lockedCount > 1 ? 's' : ''} más disponible{lockedCount > 1 ? 's' : ''}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>
            Inicia sesión para acceder al catálogo completo de guías de primeros auxilios.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn btn-primary btn-sm">Iniciar sesión</Link>
            <Link to="/register" className="btn btn-outline btn-sm">Crear cuenta gratis</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guides;
