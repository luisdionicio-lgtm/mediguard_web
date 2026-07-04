/**
 * Campo de formulario del design system (label + control + mensajes).
 *
 *   <Field label="Nombre" name="name" value={v} onChange={fn} placeholder="…" />
 *   <Field label="Relación" as="select" …>{options}</Field>
 *   <Field label="Notas" as="textarea" … />
 */
function Field({
  label,
  as = 'input',
  hint,
  error,
  className = '',
  children,
  ...controlProps
}) {
  const Control = as;
  const controlClass = `input${error ? ' is-error' : ''}`;

  return (
    <div className={`field ${className}`.trim()}>
      {label && <label className="field-label" htmlFor={controlProps.id || controlProps.name}>{label}</label>}
      <Control
        id={controlProps.id || controlProps.name}
        className={controlClass}
        {...controlProps}
      >
        {as === 'select' ? children : undefined}
      </Control>
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default Field;
