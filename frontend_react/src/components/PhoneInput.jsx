import { useState, useRef, useEffect } from 'react';

const COUNTRIES = [
  { code: 'PE', name: 'Perú',              dial: '+51',  flag: '🇵🇪' },
  { code: 'AR', name: 'Argentina',         dial: '+54',  flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivia',           dial: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil',            dial: '+55',  flag: '🇧🇷' },
  { code: 'CL', name: 'Chile',             dial: '+56',  flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia',          dial: '+57',  flag: '🇨🇴' },
  { code: 'CR', name: 'Costa Rica',        dial: '+506', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba',              dial: '+53',  flag: '🇨🇺' },
  { code: 'DO', name: 'Rep. Dominicana',   dial: '+1',   flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador',           dial: '+593', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador',       dial: '+503', flag: '🇸🇻' },
  { code: 'GT', name: 'Guatemala',         dial: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras',          dial: '+504', flag: '🇭🇳' },
  { code: 'MX', name: 'México',            dial: '+52',  flag: '🇲🇽' },
  { code: 'NI', name: 'Nicaragua',         dial: '+505', flag: '🇳🇮' },
  { code: 'PA', name: 'Panamá',            dial: '+507', flag: '🇵🇦' },
  { code: 'PY', name: 'Paraguay',          dial: '+595', flag: '🇵🇾' },
  { code: 'PR', name: 'Puerto Rico',       dial: '+1',   flag: '🇵🇷' },
  { code: 'UY', name: 'Uruguay',           dial: '+598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela',         dial: '+58',  flag: '🇻🇪' },
  { code: 'ES', name: 'España',            dial: '+34',  flag: '🇪🇸' },
  { code: 'US', name: 'Estados Unidos',    dial: '+1',   flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá',            dial: '+1',   flag: '🇨🇦' },
  { code: 'DE', name: 'Alemania',          dial: '+49',  flag: '🇩🇪' },
  { code: 'FR', name: 'Francia',           dial: '+33',  flag: '🇫🇷' },
  { code: 'GB', name: 'Reino Unido',       dial: '+44',  flag: '🇬🇧' },
  { code: 'IT', name: 'Italia',            dial: '+39',  flag: '🇮🇹' },
  { code: 'JP', name: 'Japón',             dial: '+81',  flag: '🇯🇵' },
  { code: 'CN', name: 'China',             dial: '+86',  flag: '🇨🇳' },
];

export default function PhoneInput({ value, onChange, hasError }) {
  const [country, setCountry] = useState(COUNTRIES[0]); // Perú por defecto
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState('');
  const [number, setNumber]   = useState('');
  const dropRef = useRef(null);

  /* Cierra el dropdown al hacer click fuera */
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Propaga valor completo al padre */
  const handleNumber = (e) => {
    const raw = e.target.value.replace(/[^\d\s\-]/g, '');
    setNumber(raw);
    onChange(country.dial + raw.replace(/\s/g, ''));
  };

  const selectCountry = (c) => {
    setCountry(c);
    setOpen(false);
    setSearch('');
    onChange(c.dial + number.replace(/\s/g, ''));
  };

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  return (
    <div className="phone-input-wrap" ref={dropRef}>
      {/* Selector de país */}
      <button type="button" className="phone-country-btn" onClick={() => setOpen(o => !o)}>
        <span className="phone-flag">{country.flag}</span>
        <span className="phone-dial">{country.dial}</span>
        <i className={`ti ti-chevron-${open ? 'up' : 'down'} phone-chevron`} />
      </button>

      {/* Input numérico */}
      <input
        className={`phone-number-input${hasError ? ' is-error' : ''}`}
        type="tel"
        placeholder="987 654 321"
        autoComplete="tel-national"
        value={number}
        onChange={handleNumber}
      />

      {/* Dropdown */}
      {open && (
        <div className="phone-dropdown">
          <div className="phone-search-wrap">
            <i className="ti ti-search phone-search-icon" />
            <input
              className="phone-search"
              type="text"
              placeholder="Buscar país..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="phone-list">
            {filtered.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  className={`phone-list-item${c.code === country.code ? ' active' : ''}`}
                  onClick={() => selectCountry(c)}
                >
                  <span className="phone-flag">{c.flag}</span>
                  <span className="phone-list-name">{c.name}</span>
                  <span className="phone-list-dial">{c.dial}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && <li className="phone-no-results">Sin resultados</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
