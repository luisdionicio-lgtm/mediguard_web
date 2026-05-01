function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <span className="badge">Primeros auxilios inteligentes</span>
          <h1>MediGuard AI</h1>
          <p>
            Plataforma de asistencia inmediata que orienta al usuario en
            emergencias, primeros auxilios y contacto rápido con servicios de salud.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Descargar App</button>
            <button className="btn-secondary">Ver funciones</button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://www.clarin.com/2015/05/01/ryeZT-J4x_1200x0.jpg"
            alt="Primeros auxilios MediGuard AI"
          />
        </div>
      </section>

      <section className="section">
        <h2>Funciones principales</h2>

        <div className="cards">
          <div className="card">
            <h3>Botón SOS</h3>
            <p>Acceso rápido para solicitar ayuda en situaciones críticas.</p>
          </div>

          <div className="card">
            <h3>Guías de emergencia</h3>
            <p>Instrucciones claras para quemaduras, hemorragias y accidentes comunes.</p>
          </div>

          <div className="card">
            <h3>Centros médicos cercanos</h3>
            <p>Ubicación rápida de centros de salud según la posición del usuario.</p>
          </div>
        </div>
      </section>

      <section className="info-section">
        <div>
          <h2>Preparado para actuar en momentos críticos</h2>
          <p>
            MediGuard AI combina tecnología, prevención y orientación básica para
            ayudar a las personas a responder mejor ante emergencias en hogares,
            empresas e instituciones educativas.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;