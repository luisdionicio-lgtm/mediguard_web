import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('El enlace de verificación no incluye un token válido.');
      return;
    }

    authService.verifyEmail(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message || 'Correo verificado correctamente.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(getApiErrorMessage(err, 'No se pudo verificar el correo.'));
      });
  }, [token]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
        {status === 'loading' && <Spinner center large label="Verificando tu correo…" />}

        {status === 'success' && (
          <>
            <Alert variant="success" title="Correo verificado">{message}</Alert>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
              Iniciar sesión
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <Alert variant="error" title="No se pudo verificar">{message}</Alert>
            <Link to="/dashboard" className="btn btn-outline" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
