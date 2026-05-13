import '../styles/Dashboard.css';

const Guides = () => {
  return (
    <div className="simple-page-container">
      <h1 className="section-title">Guías de <span className="highlight">Primeros Auxilios</span></h1>
      <p className="section-subtitle">Instrucciones paso a paso para emergencias.</p>
      
      <div className="dashboard-grid">
        <div className="dashboard-card primary">
          <h3>RCP (Reanimación Cardiopulmonar)</h3>
          <p>Técnica para salvar vidas en caso de paro cardíaco o ahogamiento.</p>
        </div>
        <div className="dashboard-card primary">
          <h3>Quemaduras</h3>
          <p>Cómo tratar quemaduras de primer, segundo y tercer grado.</p>
        </div>
        <div className="dashboard-card primary">
          <h3>Hemorragias</h3>
          <p>Pasos para controlar el sangrado severo.</p>
        </div>
        <div className="dashboard-card primary">
          <h3>Atragantamiento</h3>
          <p>Maniobra de Heimlich y qué hacer si alguien se atraganta.</p>
        </div>
      </div>
    </div>
  );
};

export default Guides;
