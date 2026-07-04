/**
 * Estado vacío del design system.
 *
 *   <EmptyState emoji="📭" title="Sin resultados">
 *     No hay guías disponibles por ahora.
 *   </EmptyState>
 */
function EmptyState({ emoji = '📭', title, children, action, className = '' }) {
  return (
    <div className={`empty-state animate-fade-in ${className}`.trim()}>
      <div className="empty-state-emoji" aria-hidden="true">{emoji}</div>
      {title && <h3>{title}</h3>}
      {children && <p>{children}</p>}
      {action && <div style={{ marginTop: '1rem' }}>{action}</div>}
    </div>
  );
}

export default EmptyState;
