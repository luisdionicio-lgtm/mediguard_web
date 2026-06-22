const LEVELS = {
  BASICO:     { label: 'Básico',      color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  INTERMEDIO: { label: 'Intermedio',  color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  AVANZADO:   { label: 'Avanzado',    color: '#DC2626', bg: 'rgba(220,38,38,0.15)' },
};

export default function LevelBadge({ level, size = 'sm' }) {
  const cfg = LEVELS[level] || LEVELS.BASICO;
  return (
    <span style={{
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.color}50`,
      borderRadius: 6,
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      fontSize: size === 'sm' ? '0.7rem' : '0.82rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}
