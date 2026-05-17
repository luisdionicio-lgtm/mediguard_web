import { useEffect, useState } from 'react';
import { hospitalService } from '../services/hospitalService';
import '../styles/Dashboard.css';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const data = await hospitalService.getAll();
        setHospitals(data);
      } catch {
        setError('No se pudieron cargar los centros medicos.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHospitals();
  }, []);

  return (
    <div className="simple-page-container">
      <h1 className="section-title">Centros <span className="highlight">Médicos</span></h1>
      <p className="section-subtitle">Encuentra los hospitales más cercanos.</p>

      {isLoading && (
        <div className="status-message loading">
          <p className="section-subtitle">Cargando centros médicos...</p>
        </div>
      )}
      {error && (
        <div className="status-message error">
          <p className="section-subtitle" style={{ color: '#EF4444' }}>{error}</p>
        </div>
      )}
      {!isLoading && !error && hospitals.length === 0 && (
        <div className="status-message empty">
          <p className="section-subtitle">No hay centros médicos disponibles.</p>
        </div>
      )}

      <div className="dashboard-grid">
        {hospitals.map((hospital) => (
          <div className="dashboard-card secondary" key={hospital.id}>
            <div className="card-icon">🏥</div>
            <h3>{hospital.name}</h3>
            {hospital.address && <p><strong>Dirección:</strong> {hospital.address}</p>}
            {hospital.phone && <p><strong>Teléfono:</strong> {hospital.phone}</p>}
            {hospital.latitude && hospital.longitude && (
              <p><strong>Ubicación:</strong> {hospital.latitude}, {hospital.longitude}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
