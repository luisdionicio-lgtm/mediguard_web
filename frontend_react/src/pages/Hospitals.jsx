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

      {isLoading && <p className="section-subtitle">Cargando centros medicos...</p>}
      {error && <p className="section-subtitle">{error}</p>}
      {!isLoading && !error && hospitals.length === 0 && (
        <p className="section-subtitle">No hay centros medicos disponibles.</p>
      )}

      <div className="dashboard-grid">
        {hospitals.map((hospital) => (
          <div className="dashboard-card secondary" key={hospital.id}>
            <h3>{hospital.name}</h3>
            <p>{hospital.address}</p>
            {hospital.phone && <p>Telefono: {hospital.phone}</p>}
            {hospital.latitude && hospital.longitude && (
              <p>Ubicacion: {hospital.latitude}, {hospital.longitude}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
