import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import '../styles/Dashboard.css';

const RECOMMENDED = [
  {
    id: 1,
    title: 'Control Avanzado de Hemorragias (Stop the Bleed)',
    author: 'Dra. Elena Vargas',
    rating: 4.9,
    reviews: '2,845',
    emoji: '🩸',
    image: '/images/health_news.png',
    tag: { label: 'Más vendido', cls: 'tag-warning' },
  },
  {
    id: 2,
    title: 'Tratamiento de Quemaduras de 1er y 2do grado',
    author: 'Instituto Nacional de Salud',
    rating: 4.7,
    reviews: '1,120',
    emoji: '🔥',
    tag: { label: 'Básico', cls: 'tag-brand' },
  },
  {
    id: 3,
    title: 'Maniobra de Heimlich y Atragantamientos',
    author: 'Academia MediGuard',
    rating: 4.8,
    reviews: '5,302',
    emoji: '🫁',
    tag: null,
  },
  {
    id: 4,
    title: 'Cómo actuar ante Desmayos y Convulsiones',
    author: 'Cruz Roja Internacional',
    rating: 4.6,
    reviews: '890',
    emoji: '🚑',
    tag: { label: 'Nuevo', cls: 'tag-info' },
  },
];

const CATEGORIES = [
  { emoji: '❤️', label: 'RCP y Reanimación' },
  { emoji: '🔥', label: 'Quemaduras' },
  { emoji: '🩸', label: 'Hemorragias' },
  { emoji: '🚨', label: 'Accidentes' },
];

const Dashboard = () => {
  const [userName] = useState(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      try {
        const userObj = JSON.parse(localUser);
        return userObj.first_name || userObj.nombre?.split(' ')[0] || 'Usuario';
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
    return 'Usuario';
  });

  return (
    <div className="page-container">

      {/* Hero */}
      <section className="dash-hero animate-fade-in">
        <div className="dash-hero-content">
          <h1>¡Hola, {userName}! Bienvenido a tu academia</h1>
          <p>
            Aprende a salvar vidas con nuestros cursos interactivos. Desarrolla habilidades
            críticas de primeros auxilios y prepárate para cualquier emergencia.
          </p>
          <Link to="/courses" className="btn btn-white btn-lg">
            Explorar catálogo de cursos
          </Link>
        </div>
      </section>

      {/* Seguir aprendiendo */}
      <section className="dash-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="dash-section-head">
          <h2>Seguir aprendiendo</h2>
          <Link to="/profile" className="dash-section-link">Mi aprendizaje →</Link>
        </div>

        <div className="dash-grid-2">
          {/* Curso en progreso */}
          <article className="course-tile">
            <div className="course-tile-media">
              <img src="/images/first_aid_guides.png" alt="RCP Básico" />
            </div>
            <div className="course-tile-body">
              <h3>RCP y Reanimación Básica (Adultos e Infantes)</h3>
              <p className="course-tile-meta">Dr. Carlos Martínez • Paramédico Certificado</p>
              <div>
                <div className="progress-label"><span>45% completado</span></div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </article>

          {/* Atajos rápidos */}
          <aside className="quick-panel">
            <h3>Atajos Rápidos</h3>
            <div className="quick-panel-list">
              <Link to="/guides" className="quick-link">
                <span className="quick-link-emoji">📖</span> Biblioteca de Guías
              </Link>
              <Link to="/news" className="quick-link">
                <span className="quick-link-emoji">📰</span> Noticias y Prevención
              </Link>
              <Link to="/hospitals" className="quick-link">
                <span className="quick-link-emoji">🏥</span> Mapa de Centros Médicos
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Cursos recomendados */}
      <section className="dash-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="dash-section-head">
          <h2>Los estudiantes también están viendo</h2>
        </div>

        <div className="dash-grid-4 stagger">
          {RECOMMENDED.map((course) => (
            <article className="course-tile" key={course.id}>
              <div className="course-tile-media">
                {course.image
                  ? <img src={course.image} alt={course.title} />
                  : <span aria-hidden="true">{course.emoji}</span>}
              </div>
              <div className="course-tile-body">
                <h3>{course.title}</h3>
                <p className="course-tile-meta">{course.author}</p>
                <div className="course-tile-rating">
                  <Star size={14} fill="currentColor" />
                  {course.rating}
                  <span className="count">({course.reviews})</span>
                </div>
                <div className="course-tile-footer">
                  {course.tag && <span className={`tag ${course.tag.cls}`}>{course.tag.label}</span>}
                  <span className="course-tile-price">Gratis</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Categorías */}
      <section className="dash-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="dash-section-head">
          <h2>Categorías principales</h2>
        </div>
        <div className="chip-row">
          {CATEGORIES.map((cat) => (
            <Link to="/guides" className="chip" key={cat.label}>
              <span className="chip-emoji" aria-hidden="true">{cat.emoji}</span> {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Asistente flotante */}
      <button type="button" className="fab" aria-label="Abrir asistente">
        💬
      </button>
    </div>
  );
};

export default Dashboard;
