function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-text">
          <h1>MediGuard AI</h1>
          <p>
            Aplicación inteligente de primeros auxilios que ayuda a actuar
            rápidamente en situaciones de emergencia.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Descargar App</button>
            <button className="btn-secondary">Conocer más</button>
          </div>
        </div>

        <div className="hero-card">
          <h3>Funciones principales</h3>
          <ul>
            <li>Botón SOS inmediato</li>
            <li>Guías de primeros auxilios</li>
            <li>Triaje asistido con IA</li>
            <li>Geolocalización de centros médicos</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <h2>¿Qué ofrece MediGuard AI?</h2>

        <div className="cards">
          <div className="card">
            <h3>SOS rápido</h3>
            <p>Permite solicitar ayuda inmediata en momentos críticos.</p>
          </div>

          <div className="card">
            <h3>Primeros auxilios</h3>
            <p>Brinda instrucciones claras para quemaduras, hemorragias y emergencias comunes.</p>
          </div>

          <div className="card">
            <h3>Centros cercanos</h3>
            <p>Muestra centros de salud próximos según la ubicación del usuario.</p>
          </div>
        </div>
      </section>

      <section className="section dark">
        <h2>Beneficios</h2>
        <p>
          MediGuard AI ayuda a reducir el tiempo de reacción, guía al usuario
          paso a paso y promueve la prevención en hogares, empresas e instituciones.
        </p>
      </section>
    </main>
  );
}

export default Home;