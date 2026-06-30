import { useState } from 'react';
import { Award, Download } from 'lucide-react';
import springApi from '../../api/springApi';

export default function CertificateBanner({ certificate, courseName }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  if (!certificate) return null;

  const handleDownload = async () => {
    setError('');
    setDownloading(true);
    try {
      const response = await springApi.get(
        `certificates/${certificate.enrollment_id}/download/`,
        { responseType: 'blob' },
      );
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificado-${certificate.code.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('No se pudo descargar el certificado. Intenta de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.04))',
      border: '1px solid rgba(34,197,94,0.35)',
      borderRadius: 16,
      padding: 24,
      textAlign: 'center',
    }}>
      <Award size={48} color="var(--success)" style={{ marginBottom: 12 }} />
      <h3 style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.15rem', marginBottom: 6 }}>
        🎉 ¡Curso completado!
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 4 }}>{courseName}</p>
      <p style={{ color: 'var(--text-disabled)', fontSize: '0.8rem', marginBottom: 16 }}>
        Certificado #{certificate.code} · {new Date(certificate.issued_at).toLocaleDateString('es-PE')}
      </p>
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 24px', background: 'var(--success)', color: '#fff',
          border: 'none', borderRadius: 10, fontWeight: 700, cursor: downloading ? 'default' : 'pointer',
          fontSize: '0.9rem', opacity: downloading ? 0.7 : 1,
        }}
      >
        <Download size={16} /> {downloading ? 'Generando…' : 'Descargar certificado'}
      </button>
      {error && (
        <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: 10 }}>{error}</p>
      )}
    </div>
  );
}
