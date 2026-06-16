import { Award, Download } from 'lucide-react';

export default function CertificateBanner({ certificate, courseName }) {
  if (!certificate) return null;
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
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 24px', background: 'var(--success)', color: '#fff',
        border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
      }}>
        <Download size={16} /> Descargar certificado
      </button>
    </div>
  );
}
