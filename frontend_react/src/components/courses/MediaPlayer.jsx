import { FileDown } from 'lucide-react';

export default function MediaPlayer({ mediaType, mediaUrl, title }) {
  if (!mediaUrl || mediaType === 'NINGUNO') return null;

  if (mediaType === 'VIDEO') {
    return (
      <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
        <video
          src={mediaUrl}
          controls
          style={{ width: '100%', height: '100%' }}
          title={title}
        />
      </div>
    );
  }

  if (mediaType === 'AUDIO') {
    return (
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🎧</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{title}</p>
        <audio src={mediaUrl} controls style={{ width: '100%' }} />
      </div>
    );
  }

  if (mediaType === 'PDF') {
    return (
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <iframe
          src={mediaUrl}
          title={title}
          style={{ width: '100%', height: '70vh', border: 'none' }}
        />
        <div style={{ padding: '10px 16px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <a href={mediaUrl} download target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
            <FileDown size={16} /> Descargar PDF
          </a>
        </div>
      </div>
    );
  }

  if (mediaType === 'IMAGEN') {
    return (
      <div style={{ borderRadius: 12, overflow: 'hidden', background: 'var(--bg)', textAlign: 'center' }}>
        <img src={mediaUrl} alt={title} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
      </div>
    );
  }

  return null;
}
