import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

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
    <div className="dashboard-container page-container" style={{ padding: '80px 5% 60px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Udemy-style Hero Banner */}
      <div className="udemy-hero animate-fade-in" style={{ backgroundColor: 'var(--blue-deep)', borderRadius: 'var(--radius-xl)', padding: '3rem', color: 'var(--white)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ zIndex: 2, maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: '800', color: 'var(--white)', textShadow: 'none', background: 'none' }}>¡Hola, {userName}! Bienvenido a tu academia</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--teal-light)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Aprende a salvar vidas con nuestros cursos interactivos. Desarrolla habilidades críticas de primeros auxilios y prepárate para cualquier emergencia.
          </p>
          <Link to="/guides" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', backgroundColor: 'var(--teal-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: '700', textDecoration: 'none', display: 'inline-block' }}>
            Explorar catálogo de cursos
          </Link>
        </div >

        {/* Decoración gráfica */}
        < div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '300px', height: '300px', backgroundColor: 'var(--teal-dark)', borderRadius: '50%', opacity: 0.5, zIndex: 1 }}></div >
        <div style={{ position: 'absolute', right: '150px', bottom: '-80px', width: '200px', height: '200px', backgroundColor: 'var(--teal-primary)', borderRadius: '50%', opacity: 0.3, zIndex: 1 }}></div>
      </div >

      {/* Seguir Aprendiendo (My Learning) */}
      < div className="dashboard-section animate-fade-in" style={{ animationDelay: '0.1s', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-deep)', fontWeight: '800' }}>Seguir aprendiendo</h2>
          <Link to="/profile" style={{ color: 'var(--teal-primary)', fontWeight: '700', textDecoration: 'none' }}>Mi aprendizaje</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {/* Curso en progreso */}
          <div className="udemy-card" style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--white)', transition: 'box-shadow 0.3s', cursor: 'pointer' }}>
            <div style={{ position: 'relative', height: '170px' }}>
              <img src="/images/first_aid_guides.png" alt="RCP Básico" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s' }} className="play-overlay">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              </div>
            </div>
            <div style={{ padding: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--blue-deep)', marginBottom: '0.5rem', lineHeight: '1.3' }}>RCP y Reanimación Básica (Adultos e Infantes)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--blue-mid)', marginBottom: '0.75rem' }}>Dr. Carlos Martínez • Paramédico Certificado</p>

              {/* Barra de progreso */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem', color: 'var(--blue-mid)', fontWeight: '600' }}>
                  <span>45% completado</span>
                </div>
                <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--gray-200)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--teal-primary)' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tools adaptado al diseño */}
          <div style={{ border: '1px solid var(--teal-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--teal-surface)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--teal-dark)', fontWeight: '800' }}>Atajos Rápidos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
              <Link to="/guides" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', backgroundColor: 'var(--white)', color: 'var(--blue-deep)', fontWeight: '600', borderRadius: 'var(--radius-md)', border: '1px solid var(--teal-light)', transition: 'background-color 0.2s' }}>
                <span style={{ fontSize: '1.2rem' }}>📖</span> Biblioteca de Guías
              </Link>
              <Link to="/news" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', backgroundColor: 'var(--white)', color: 'var(--blue-deep)', fontWeight: '600', borderRadius: 'var(--radius-md)', border: '1px solid var(--teal-light)', transition: 'background-color 0.2s' }}>
                <span style={{ fontSize: '1.2rem' }}>📰</span> Noticias y Prevención
              </Link>
              <Link to="/hospitals" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none', backgroundColor: 'var(--white)', color: 'var(--blue-deep)', fontWeight: '600', borderRadius: 'var(--radius-md)', border: '1px solid var(--teal-light)', transition: 'background-color 0.2s' }}>
                <span style={{ fontSize: '1.2rem' }}>🏥</span> Mapa de Centros Médicos
              </Link>
            </div>
          </div>

        </div>
      </div >

      {/* Cursos Recomendados */}
      < div className="dashboard-section animate-fade-in" style={{ animationDelay: '0.2s', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-deep)', fontWeight: '800', marginBottom: '1.5rem' }}>Los estudiantes también están viendo</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>

          {/* Udemy Course Card 1 */}
          <div className="udemy-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--white)', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '150px' }}>
                <img src="/images/health_news.png" alt="Control de Hemorragias" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--blue-deep)', marginBottom: '0.25rem', lineHeight: '1.3' }}>Control Avanzado de Hemorragias (Stop the Bleed)</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--blue-light)', marginBottom: '0.5rem' }}>Dra. Elena Vargas</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b4690e' }}>4.9</span>
                  <span style={{ color: '#b4690e', fontSize: '0.8rem' }}>⭐⭐⭐⭐⭐</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--blue-light)' }}>(2,845)</span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: '#eceb98', color: '#3d3c0a', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>Más vendido</span>
                  <span style={{ fontWeight: '800', color: 'var(--blue-deep)', fontSize: '1rem' }}>Gratis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Udemy Course Card 2 */}
          <div className="udemy-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--white)', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '150px', backgroundColor: 'var(--red-light)' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🔥</div>
              </div>
              <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--blue-deep)', marginBottom: '0.25rem', lineHeight: '1.3' }}>Tratamiento de Quemaduras de 1er y 2do grado</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--blue-light)', marginBottom: '0.5rem' }}>Instituto Nacional de Salud</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b4690e' }}>4.7</span>
                  <span style={{ color: '#b4690e', fontSize: '0.8rem' }}>⭐⭐⭐⭐½</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--blue-light)' }}>(1,120)</span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: 'var(--teal-light)', color: 'var(--teal-dark)', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>Básico</span>
                  <span style={{ fontWeight: '800', color: 'var(--blue-deep)', fontSize: '1rem' }}>Gratis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Udemy Course Card 3 */}
          <div className="udemy-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--white)', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '150px', backgroundColor: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '3rem' }}>🤐</div>
              </div>
              <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--blue-deep)', marginBottom: '0.25rem', lineHeight: '1.3' }}>Maniobra de Heimlich y Atragantamientos</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--blue-light)', marginBottom: '0.5rem' }}>Academia MediGuard</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b4690e' }}>4.8</span>
                  <span style={{ color: '#b4690e', fontSize: '0.8rem' }}>⭐⭐⭐⭐⭐</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--blue-light)' }}>(5,302)</span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '800', color: 'var(--blue-deep)', fontSize: '1rem' }}>Gratis</span>
                </div>
              </div>
            </div>
          </div>

          {/* Udemy Course Card 4 */}
          <div className="udemy-card-hover" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--white)', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '150px', backgroundColor: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '3rem' }}>😵</div>
              </div>
              <div style={{ padding: '1rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--blue-deep)', marginBottom: '0.25rem', lineHeight: '1.3' }}>Cómo actuar ante Desmayos y Convulsiones</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--blue-light)', marginBottom: '0.5rem' }}>Cruz Roja Internacional</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#b4690e' }}>4.6</span>
                  <span style={{ color: '#b4690e', fontSize: '0.8rem' }}>⭐⭐⭐⭐½</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--blue-light)' }}>(890)</span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ backgroundColor: 'var(--blue-light)', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>Nuevo</span>
                  <span style={{ fontWeight: '800', color: 'var(--blue-deep)', fontSize: '1rem' }}>Gratis</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div >

      {/* Guías Rápidas como "Categorías populares" en Udemy */}
      < div className="dashboard-section animate-fade-in" style={{ animationDelay: '0.3s', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--blue-deep)', fontWeight: '800', marginBottom: '1.5rem' }}>Categorías principales</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/guides" className="quick-guide-chip" style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--blue-deep)', borderRadius: 'var(--radius-md)', fontWeight: '700', color: 'var(--blue-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', flexGrow: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>❤️</span> RCP y Reanimación
          </Link>
          <Link to="/guides" className="quick-guide-chip" style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--blue-deep)', borderRadius: 'var(--radius-md)', fontWeight: '700', color: 'var(--blue-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', flexGrow: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>🔥</span> Quemaduras
          </Link>
          <Link to="/guides" className="quick-guide-chip" style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--blue-deep)', borderRadius: 'var(--radius-md)', fontWeight: '700', color: 'var(--blue-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', flexGrow: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>🩸</span> Hemorragias
          </Link>
          <Link to="/guides" className="quick-guide-chip" style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--white)', border: '1px solid var(--blue-deep)', borderRadius: 'var(--radius-md)', fontWeight: '700', color: 'var(--blue-deep)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s', flexGrow: 1, justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>🚨</span> Accidentes
          </Link>
        </div>
      </div >

      {/* Botón Flotante de Chat/Asistente (estilo plataforma educativa) */}
      < div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 100 }}>
        <button style={{ width: '60px', height: '60px', backgroundColor: 'var(--teal-primary)', borderRadius: '50%', border: 'none', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white', cursor: 'pointer', transition: 'transform 0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          💬
        </button>
      </div >

    </div >
  );
};

export default Dashboard;
