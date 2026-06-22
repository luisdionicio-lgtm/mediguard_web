import { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';
import { newsService } from '../services/newsService';
import PageHeader from '../components/ui/PageHeader';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import '../styles/Dashboard.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await newsService.getAll();
        setNews(data);
      } catch {
        setError('No se pudieron cargar las noticias de salud.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <div className="page-container">
      <PageHeader
        title={<>Noticias de <span className="highlight">Salud</span></>}
        subtitle="Últimas alertas de salud, estudios de medicina y consejos preventivos actualizados."
      />

      {isLoading && <Spinner center large label="Obteniendo noticias médicas…" />}

      {error && <Alert variant="error">{error}</Alert>}

      {!isLoading && !error && news.length === 0 && (
        <EmptyState emoji="📰" title="Sin noticias">
          No hay noticias de salud disponibles actualmente.
        </EmptyState>
      )}

      <div className="resource-grid stagger">
        {news.map((item) => (
          <article className="resource-card accent-info" key={item.id}>
            <div className="resource-card-icon">
              <Newspaper size={22} />
            </div>

            <div className="resource-card-top">
              <span className="tag tag-info">Boletín Oficial</span>
              <span className="resource-card-meta">Hoy</span>
            </div>

            <h3>{item.title}</h3>

            {item.summary && (
              <p className="resource-card-sub">{item.summary}</p>
            )}

            {item.content && (
              <p className="resource-card-desc">{item.content}</p>
            )}

            <div className="resource-card-actions">
              <button type="button" className="btn btn-outline btn-full">
                Leer Artículo Completo
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default News;
