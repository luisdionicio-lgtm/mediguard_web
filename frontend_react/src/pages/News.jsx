import { useEffect, useState } from 'react';
import { newsService } from '../services/newsService';
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
    <div className="simple-page-container animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Noticias de <span className="highlight">Salud</span></h1>
        <p className="section-subtitle">Últimas alertas de salud, estudios de medicina y consejos preventivos actualizados.</p>
      </div>

      {isLoading && (
        <div className="status-message loading animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <svg className="badge-pulse" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--blue-deep)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
          <p className="section-subtitle" style={{ marginTop: '10px' }}>Obteniendo noticias médicas...</p>
        </div>
      )}
      
      {error && (
        <div className="status-message error animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-subtitle" style={{ color: '#EF4444' }}>{error}</p>
        </div>
      )}

      {!isLoading && !error && news.length === 0 && (
        <div className="status-message empty animate-fade-in" style={{ textAlign: 'center', padding: '40px' }}>
          <p className="section-subtitle">No hay noticias de salud disponibles actualmente.</p>
        </div>
      )}

      <div className="dashboard-premium-grid">
        {news.map((item, index) => (
          <div 
            className="premium-card animate-fade-in" 
            key={item.id}
            style={{ 
              animationDelay: `${0.1 * (index + 1)}s`,
              borderTop: '6px solid var(--blue-deep)'
            }}
          >
            <div className="premium-card-content" style={{ padding: '2rem 1.5rem 1.5rem' }}>
              <div className="card-icon-wrapper text-dark" style={{ top: '-28px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path><path d="M18 14h-8"></path><path d="M15 18h-5"></path></svg>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="card-badge bg-dark">
                  Boletín Oficial
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--blue-light)', fontWeight: '600' }}>Hoy</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', color: 'var(--blue-deep)', fontWeight: '700', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                {item.title}
              </h3>
              
              {item.summary && (
                <p style={{ color: 'var(--blue-mid)', fontWeight: '600', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic', lineHeight: '1.5' }}>
                  {item.summary}
                </p>
              )}

              {item.content && (
                <p style={{ color: 'var(--blue-light)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6', flexGrow: 1 }}>
                  {item.content}
                </p>
              )}

              <div className="premium-card-actions" style={{ marginTop: 'auto' }}>
                <button className="btn btn-outline-dark btn-full" style={{ padding: '0.6rem' }}>
                  Leer Artículo Completo
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
