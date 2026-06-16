import { X } from 'lucide-react';
import { useCategories } from '../../hooks/useCourse';

const LEVELS = ['BASICO', 'INTERMEDIO', 'AVANZADO'];
const DURATIONS = [{ value: '<1h', label: 'Menos de 1h' }, { value: '1-3h', label: '1 a 3 horas' }, { value: '+3h', label: 'Más de 3h' }];
const ORDERINGS = [{ value: '-published_at', label: 'Más recientes' }, { value: '-rating', label: 'Mejor valorados' }];

const s = {
  sidebar: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 24 },
  section: { display: 'flex', flexDirection: 'column', gap: 10 },
  title: { color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 },
  checkRow: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
  check: { width: 16, height: 16, accentColor: 'var(--success)', cursor: 'pointer' },
  label: { color: 'var(--text-secondary)', fontSize: '0.88rem' },
  radio: { width: 16, height: 16, accentColor: 'var(--success)', cursor: 'pointer' },
};

export default function CourseFilters({ filters, onChange, onClose }) {
  const { data: categories = [] } = useCategories();

  const set = (key, val) => onChange({ ...filters, [key]: val });
  const toggleCategory = (slug) => set('category', filters.category === slug ? '' : slug);

  return (
    <div style={s.sidebar}>
      {onClose && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Filtros</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
      )}

      {/* Categorías */}
      <div style={s.section}>
        <p style={s.title}>Categorías</p>
        {categories.map((cat) => (
          <label key={cat.id} style={s.checkRow}>
            <input type="checkbox" style={s.check} checked={filters.category === cat.slug} onChange={() => toggleCategory(cat.slug)} />
            <span style={s.label}>{cat.name}</span>
          </label>
        ))}
        {categories.length === 0 && <span style={{ color: 'var(--text-disabled)', fontSize: '0.82rem' }}>Cargando…</span>}
      </div>

      {/* Nivel */}
      <div style={s.section}>
        <p style={s.title}>Nivel</p>
        {LEVELS.map((lv) => (
          <label key={lv} style={s.checkRow}>
            <input type="radio" name="level" style={s.radio} checked={filters.level === lv} onChange={() => set('level', lv)} />
            <span style={s.label}>{lv.charAt(0) + lv.slice(1).toLowerCase()}</span>
          </label>
        ))}
        {filters.level && (
          <button onClick={() => set('level', '')} style={{ color: 'var(--error)', background: 'none', border: 'none', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}>✕ Limpiar nivel</button>
        )}
      </div>

      {/* Duración */}
      <div style={s.section}>
        <p style={s.title}>Duración</p>
        {DURATIONS.map((d) => (
          <label key={d.value} style={s.checkRow}>
            <input type="radio" name="duration" style={s.radio} checked={filters.duration === d.value} onChange={() => set('duration', d.value)} />
            <span style={s.label}>{d.label}</span>
          </label>
        ))}
        {filters.duration && (
          <button onClick={() => set('duration', '')} style={{ color: 'var(--error)', background: 'none', border: 'none', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', padding: 0 }}>✕ Limpiar duración</button>
        )}
      </div>

      {/* Ordenar */}
      <div style={s.section}>
        <p style={s.title}>Ordenar por</p>
        {ORDERINGS.map((o) => (
          <label key={o.value} style={s.checkRow}>
            <input type="radio" name="ordering" style={s.radio} checked={(filters.ordering || '-published_at') === o.value} onChange={() => set('ordering', o.value)} />
            <span style={s.label}>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
