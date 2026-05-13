import '../styles/Dashboard.css';

const Hospitals = () => {
  return (
    <div className="simple-page-container">
      <h1 className="section-title">Centros <span className="highlight">Médicos</span></h1>
      <p className="section-subtitle">Encuentra los hospitales más cercanos.</p>
      <div className="dashboard-grid">
        <div className="dashboard-card secondary">
          <h3>Hospital Rebagliati</h3>
          <p>Av. Edgardo Rebagliati Martins 490, Jesús María.</p>
        </div>
        <div className="dashboard-card secondary">
          <h3>Clínica Ricardo Palma</h3>
          <p>Av. Javier Prado Este 1066, San Isidro.</p>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
