import { useEffect, useRef, useState } from 'react';

/* Contador animado desde 0 hasta target */
function Counter({ target, suffix = '', duration = 1800 }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return <>{value.toLocaleString()}{suffix}</>;
}

const STATS = [
  {
    value: 12480,
    suffix: '+',
    label: 'Usuarios activos',
    icon: '👥',
    color: '#4ADE80',
    bg: 'rgba(74,222,128,0.10)',
    border: 'rgba(74,222,128,0.25)',
    bar: '#4ADE80',
    barPct: 88,
  },
  {
    value: 98,
    suffix: '%',
    label: 'Satisfacción',
    icon: '⭐',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.10)',
    border: 'rgba(245,158,11,0.25)',
    bar: '#F59E0B',
    barPct: 98,
  },
  {
    value: 2,
    suffix: ' min',
    label: 'Tiempo de respuesta',
    icon: '⚡',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.10)',
    border: 'rgba(239,68,68,0.25)',
    bar: '#EF4444',
    barPct: 72,
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Disponibilidad',
    icon: '🛡️',
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.10)',
    border: 'rgba(96,165,250,0.25)',
    bar: '#60A5FA',
    barPct: 100,
  },
];

export default function AuthStats() {
  return (
    <div className="auth-stats-panel">
      <p className="auth-stats-heading">¿Por qué elegirnos?</p>
      <div className="auth-stats-list">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="auth-stat-card"
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              animationDelay: `${i * 0.12}s`,
            }}
          >
            <div className="auth-stat-top">
              <span className="auth-stat-icon">{s.icon}</span>
              <span className="auth-stat-number" style={{ color: s.color }}>
                <Counter target={s.value} suffix={s.suffix} duration={1400 + i * 200} />
              </span>
            </div>
            <p className="auth-stat-label">{s.label}</p>
            {/* Barra de progreso animada */}
            <div className="auth-stat-bar-track">
              <div
                className="auth-stat-bar-fill"
                style={{ background: s.color, '--pct': `${s.barPct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
