/**
 * Spinner del design system.
 *
 *   <Spinner />                          → spinner inline
 *   <Spinner center label="Cargando…" /> → bloque centrado con texto
 */
function Spinner({ center = false, large = false, label, className = '' }) {
  const spinner = (
    <span
      className={`spinner${large ? ' spinner-lg' : ''} ${className}`.trim()}
      role="status"
      aria-label={label || 'Cargando'}
    />
  );

  if (!center) return spinner;

  return (
    <div className="spinner-center animate-fade-in">
      {spinner}
      {label && <p>{label}</p>}
    </div>
  );
}

export default Spinner;
