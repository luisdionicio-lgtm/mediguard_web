import '../styles/Dashboard.css';

const News = () => {
  return (
    <div className="simple-page-container">
      <h1 className="section-title">Noticias de <span className="highlight">Salud</span></h1>
      <p className="section-subtitle">Mantente al día con las últimas noticias.</p>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Campaña de Vacunación</h3>
          <p>El Minsa inicia campaña de vacunación a nivel nacional. Infórmate sobre los puntos de vacunación.</p>
        </div>
        <div className="dashboard-card">
          <h3>Prevención del Dengue</h3>
          <p>Conoce las medidas de prevención para evitar la propagación del mosquito transmisor del dengue.</p>
        </div>
      </div>
    </div>
  );
};

export default News;
