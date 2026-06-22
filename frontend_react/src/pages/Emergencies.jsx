import { useEffect, useState } from 'react';
import { PhoneCall, Siren } from 'lucide-react';
import { emergencyService } from '../services/emergencyService';
import { getApiErrorMessage } from '../services/errorService';
import PageHeader from '../components/ui/PageHeader';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import '../styles/Dashboard.css';

const getCurrentPosition = () => new Promise((resolve) => {
  if (!navigator.geolocation) {
    resolve({});
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => resolve({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }),
    () => resolve({}),
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
  );
});

const Emergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sosLoading, setSosLoading] = useState(false);
  const [sosMessage, setSosMessage] = useState('');
  const [sosFeedback, setSosFeedback] = useState(null);
  const [sosError, setSosError] = useState('');

  useEffect(() => {
    const loadEmergencies = async () => {
      try {
        const data = await emergencyService.getAll();
        setEmergencies(data);
      } catch {
        setError('No se pudieron cargar los contactos de emergencia.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEmergencies();
  }, []);

  const handleCreateSos = async () => {
    setSosMessage('');
    setSosFeedback(null);
    setSosError('');
    setSosLoading(true);

    try {
      const position = await getCurrentPosition();
      const event = await emergencyService.createSosEvent({
        status: 'activado',
        device: navigator.userAgent.slice(0, 100),
        notes: 'SOS activado desde la web',
        ...position,
      });
      setSosMessage('SOS registrado correctamente.');
      setSosFeedback(event);
    } catch (err) {
      setSosError(getApiErrorMessage(err, 'No se pudo registrar el evento SOS.'));
    } finally {
      setSosLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title={<>Contactos de <span className="highlight-danger">Emergencia</span></>}
        subtitle="Líneas de ayuda crítica y servicios vitales disponibles las 24 horas."
      >
        <div style={{ marginTop: '1.5rem', display: 'grid', justifyItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-emergency btn-lg"
            onClick={handleCreateSos}
            disabled={sosLoading}
          >
            <Siren size={18} />
            {sosLoading ? 'Registrando SOS…' : 'Activar SOS'}
          </button>
          {sosMessage && <Alert variant="success">{sosMessage}</Alert>}
          {sosFeedback && (
            <Alert variant="info">
              <div>
                <p>
                  {sosFeedback.location_available
                    ? 'Ubicación obtenida y asociada al evento.'
                    : 'Ubicación no disponible; el SOS fue registrado igualmente.'}
                </p>
                <p>
                  Contactos asociados detectados: {sosFeedback.contacts_found ?? 0}.
                  {' '}Contactos notificables: {sosFeedback.notifiable_contacts ?? 0}.
                </p>
                {!sosFeedback.real_notification_enabled && (
                  <p>Notificación real pendiente de integración; no se enviaron avisos.</p>
                )}
              </div>
            </Alert>
          )}
          {sosError && <Alert variant="error">{sosError}</Alert>}
        </div>
      </PageHeader>

      {isLoading && <Spinner center large label="Cargando directorio de emergencia…" />}

      {error && <Alert variant="error">{error}</Alert>}

      {!isLoading && !error && emergencies.length === 0 && (
        <EmptyState emoji="🚨" title="Sin contactos de emergencia">
          No hay contactos de emergencia disponibles actualmente.
        </EmptyState>
      )}

      <div className="resource-grid stagger">
        {emergencies.map((emergency) => (
          <article className="resource-card accent-error" key={emergency.id}>
            <div className="resource-card-icon">
              <PhoneCall size={22} />
            </div>

            <div className="resource-card-top">
              <span className="tag tag-error">24/7 Disponible</span>
              <span className="live-dot" aria-hidden="true" />
            </div>

            <h3>{emergency.name}</h3>

            {emergency.serviceType && (
              <p className="resource-card-sub" style={{ color: 'var(--brand)' }}>
                {emergency.serviceType}
              </p>
            )}

            {emergency.description && (
              <p className="resource-card-desc">{emergency.description}</p>
            )}

            <div className="resource-card-actions">
              <a href={`tel:${emergency.phone}`} className="btn btn-emergency btn-full">
                <PhoneCall size={16} />
                Llamar {emergency.phone}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Emergencies;
