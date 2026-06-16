export default function ProgressBar({ value = 0, max = 100, label, showPercent = true, color = 'var(--success)', height = 6 }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {label && <span>{label}</span>}
          {showPercent && <span style={{ color, fontWeight: 600 }}>{pct}%</span>}
        </div>
      )}
      <div style={{ height, borderRadius: 999, background: 'var(--surface-2)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}
