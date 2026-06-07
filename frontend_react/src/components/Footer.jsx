import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  const platform = [
    { label: 'Inicio',        href: '/' },
    { label: 'Funcionalidades', href: '/#features' },
    { label: 'Beneficios',    href: '/#benefits' },
    { label: 'El Proyecto',   href: '/#about' },
  ];

  const account = [
    { label: 'Ingresar',       to: '/login' },
    { label: 'Crear cuenta',   to: '/register' },
    { label: 'Dashboard',      to: '/dashboard' },
    { label: 'Mi Perfil',      to: '/profile' },
  ];

  const team = [
    { initials: 'LD', name: 'Luis Dionicio',   role: 'Frontend Dev' },
    { initials: 'RQ', name: 'Rony Quintana',   role: 'Mobile Dev' },
    { initials: 'JO', name: 'Jeronimo Ortiz',  role: 'Backend Dev' },
  ];

  return (
    <footer className="footer">
      <div className="footer-body">
        {/* Brand col */}
        <div className="footer-brand-col">
          <div className="footer-logo-row">
            <div className="footer-logo-dot">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="footer-logo-name">MediGuard AI</span>
          </div>
          <p className="footer-brand-desc">
            Plataforma médica inteligente que pone la asistencia vital en tu bolsillo.
            Prevención, primeros auxilios y conexión con servicios de salud, todo en un solo lugar.
          </p>
          <span className="footer-badge">
            <span className="footer-badge-dot" />
            Proyecto Integrador — TECSUP 2026
          </span>
        </div>

        {/* Platform col */}
        <div>
          <p className="footer-col-title">Plataforma</p>
          <ul className="footer-link-list">
            {platform.map(l => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Account col */}
        <div>
          <p className="footer-col-title">Mi cuenta</p>
          <ul className="footer-link-list">
            {account.map(l => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Team col */}
        <div>
          <p className="footer-col-title">Equipo Scrum</p>
          <ul className="footer-team-list">
            {team.map(m => (
              <li key={m.name} className="footer-team-item">
                <div className="footer-team-avatar">{m.initials}</div>
                <div className="footer-team-info">
                  <p className="footer-team-name">{m.name}</p>
                  <p className="footer-team-role">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span className="footer-copyright">
            © {year} MediGuard AI. Todos los derechos reservados.
          </span>
          <span className="footer-built-with">
            <span className="footer-built-dot" />
            React · Django · IA — Proyecto Académico
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
