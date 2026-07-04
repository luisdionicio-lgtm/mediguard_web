import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const VARIANTS = {
  success: { cls: 'alert-success', Icon: CheckCircle2 },
  error:   { cls: 'alert-error',   Icon: AlertCircle },
  warning: { cls: 'alert-warning', Icon: AlertTriangle },
  info:    { cls: 'alert-info',    Icon: Info },
};

/**
 * Alert del design system.
 *
 *   <Alert variant="error">No se pudo cargar.</Alert>
 *   <Alert variant="success" title="Listo">Contacto guardado.</Alert>
 */
function Alert({ variant = 'info', title, children, className = '', ...props }) {
  const { cls, Icon } = VARIANTS[variant] ?? VARIANTS.info;

  return (
    <div role="alert" className={`alert ${cls} ${className}`.trim()} {...props}>
      <Icon size={17} className="alert-icon" />
      <div>
        {title && <div className="alert-title">{title}</div>}
        {children}
      </div>
    </div>
  );
}

export default Alert;
