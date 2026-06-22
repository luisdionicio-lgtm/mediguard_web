/**
 * Encabezado de página del design system.
 *
 *   <PageHeader
 *     title={<>Guías de <span className="highlight">Primeros Auxilios</span></>}
 *     subtitle="Instrucciones paso a paso."
 *   />
 */
function PageHeader({ title, subtitle, children, className = '' }) {
  return (
    <header className={`page-head animate-fade-in ${className}`.trim()}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </header>
  );
}

export default PageHeader;
