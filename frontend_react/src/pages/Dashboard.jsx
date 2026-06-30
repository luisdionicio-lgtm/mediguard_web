import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useCategories } from '../hooks/useCourse';
import { useMyEnrollments } from '../hooks/useMyEnrollments';
import { formatDuration } from '../components/courses/CourseCard';
import '../styles/Dashboard.css';

const CATEGORY_EMOJI = {
  rcp: '❤️', hemorragias: '🩸', quemaduras: '🔥', accidentes: '🚨',
  ahogamiento: '🫁', fracturas: '🦴', pediatria: '👶', 'golpe-de-calor': '🌡️',
};

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

  const { data: coursesPages, isLoading: loadingCourses, isError: coursesError } = useCourses({ ordering: '-rating_avg' });
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: enrollments = [], isLoading: loadingEnrollments } = useMyEnrollments();

  const courses = coursesPages?.pages?.flatMap((p) => p.results ?? p) ?? [];
  const recommended = courses.slice(0, 4);

  const activeEnrollment = enrollments.find((e) => !e.completed_at);
  const enrolledCourseId = activeEnrollment?.course_id ?? activeEnrollment?.course;
  const inProgressCourse = courses.find((c) => c.id === enrolledCourseId);

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
          {loadingEnrollments ? (
            <article className="course-tile">
              <div className="course-tile-body"><p className="course-tile-meta">Cargando tu progreso…</p></div>
            </article>
          ) : inProgressCourse ? (
            <Link to={`/courses/${inProgressCourse.slug}/learn`} style={{ textDecoration: 'none' }}>
              <article className="course-tile">
                <div className="course-tile-media">
                  {inProgressCourse.thumbnail_url
                    ? <img src={inProgressCourse.thumbnail_url} alt={inProgressCourse.title} />
                    : <span aria-hidden="true">🩺</span>}
                </div>
                <div className="course-tile-body">
                  <h3>{inProgressCourse.title}</h3>
                  <p className="course-tile-meta">{formatDuration(inProgressCourse.duration_min)}</p>
                  <div>
                    <div className="progress-label"><span>Continúa donde lo dejaste</span></div>
                  </div>
                </div>
              </article>
            </Link>
          ) : (
            <article className="course-tile">
              <div className="course-tile-body">
                <h3>Aún no tienes cursos en progreso</h3>
                <p className="course-tile-meta">Inscríbete en un curso del catálogo para empezar.</p>
                <Link to="/courses" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}>
                  Ver catálogo
                </Link>
              </div>
            </article>
          )}

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

        {loadingCourses && <p className="course-tile-meta">Cargando cursos…</p>}
        {coursesError && (
          <p className="course-tile-meta" style={{ color: 'var(--error)' }}>
            No se pudieron cargar los cursos. Verifica tu conexión.
          </p>
        )}
        {!loadingCourses && !coursesError && recommended.length === 0 && (
          <p className="course-tile-meta">
            Aún no hay cursos publicados.{' '}
            <Link to="/courses" style={{ color: 'var(--brand)' }}>Explorar catálogo</Link>
          </p>
        )}
        {!loadingCourses && !coursesError && recommended.length > 0 && (
          <div className="dash-grid-4 stagger">
            {recommended.map((course) => (
              <Link to={`/courses/${course.slug}`} key={course.id} style={{ textDecoration: 'none' }}>
                <article className="course-tile">
                  <div className="course-tile-media">
                    {course.thumbnail_url
                      ? <img src={course.thumbnail_url} alt={course.title} />
                      : <span aria-hidden="true">🩺</span>}
                  </div>
                  <div className="course-tile-body">
                    <h3>{course.title}</h3>
                    <p className="course-tile-meta">{course.category?.name || 'General'}</p>
                    <div className="course-tile-rating">
                      <Star size={14} fill="currentColor" />
                      {course.rating_avg ? course.rating_avg.toFixed(1) : 'Sin valorar'}
                    </div>
                    <div className="course-tile-footer">
                      <span className="course-tile-price">Gratis</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categorías */}
      <section className="dash-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="dash-section-head">
          <h2>Categorías principales</h2>
        </div>
        <div className="chip-row">
          {loadingCategories ? (
            <p className="course-tile-meta">Cargando categorías…</p>
          ) : categories.length === 0 ? (
            <p className="course-tile-meta">No hay categorías disponibles aún.</p>
          ) : categories.map((cat) => (
            <Link to={`/courses?category=${cat.slug}`} className="chip" key={cat.id}>
              <span className="chip-emoji" aria-hidden="true">{CATEGORY_EMOJI[cat.slug] || '🩹'}</span> {cat.name}
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
