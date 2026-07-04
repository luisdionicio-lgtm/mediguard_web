import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { hospitalService } from '../services/hospitalService';
import PageHeader from '../components/ui/PageHeader';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
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
        setError('No se pudieron cargar los centros médicos.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHospitals();
  }, []);

  return (
    <div className="page-container">
      <PageHeader
        title={<>Centros <span className="highlight">Médicos</span></>}
        subtitle="Red nacional de hospitales, clínicas y centros de trauma más cercanos a ti."
      />

      {isLoading && <Spinner center large label="Localizando centros médicos…" />}

      {error && <Alert variant="error">{error}</Alert>}

      {!isLoading && !error && hospitals.length === 0 && (
        <EmptyState emoji="🏥" title="Sin centros médicos">
          No hay centros médicos disponibles por ahora.
        </EmptyState>
      )}

      <div className="resource-grid stagger">
        {hospitals.map((hospital) => (
          <article className="resource-card accent-secondary" key={hospital.id}>
            <div className="resource-card-icon">
              <Building2 size={22} />
            </div>

            <div className="resource-card-top">
              <span className="tag tag-brand">Servicio Público / Privado</span>
              <span className="tag tag-brand">Abierto</span>
            </div>

            <h3>{hospital.name}</h3>

            <ul className="kv-list">
              {hospital.address && (
                <li>
                  <span className="k">Dirección:</span>
                  <span className="v">{hospital.address}</span>
                </li>
              )}
              {hospital.phone && (
                <li>
                  <span className="k">Contacto:</span>
                  <span className="v">{hospital.phone}</span>
                </li>
              )}
              {hospital.latitude && hospital.longitude && (
                <li>
                  <span className="k">Coordenadas:</span>
                  <span className="v">{hospital.latitude}, {hospital.longitude}</span>
                </li>
              )}
            </ul>

            <div className="resource-card-actions">
              {hospital.phone && (
                <a href={`tel:${hospital.phone}`} className="btn btn-secondary" style={{ flex: 1 }}>
                  Llamar
                </a>
              )}
              <button type="button" className="btn btn-primary" style={{ flex: 2 }}>
                Cómo Llegar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
