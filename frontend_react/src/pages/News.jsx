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
    <div className="simple-page-container">
      <h1 className="section-title">Noticias de <span className="highlight">Salud</span></h1>
      <p className="section-subtitle">Mantente al día con las últimas noticias.</p>

      {isLoading && <p className="section-subtitle">Cargando noticias...</p>}
      {error && <p className="section-subtitle">{error}</p>}
      {!isLoading && !error && news.length === 0 && (
        <p className="section-subtitle">No hay noticias disponibles.</p>
      )}

      <div className="dashboard-grid">
        {news.map((item) => (
          <div className="dashboard-card" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
