import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const PLATFORM = [
  { label: 'Inicio',           href: '/' },
  { label: 'Funcionalidades',  href: '/#features' },
  { label: 'Beneficios',       href: '/#benefits' },
  { label: 'El Proyecto',      href: '/#about' },
];

const ACCOUNT = [
  { label: 'Ingresar',     to: '/login' },
  { label: 'Crear cuenta', to: '/register' },
  { label: 'Dashboard',    to: '/dashboard' },
  { label: 'Mi Perfil',    to: '/profile' },
];

const TEAM = [
  { initials: 'LD', name: 'Luis Dionicio',  role: 'Frontend Dev', cls: 'av-ld' },
  { initials: 'RQ', name: 'Rony Quintana',  role: 'Mobile Dev',   cls: 'av-rq' },
  { initials: 'JO', name: 'Jeronimo Ortiz', role: 'Backend Dev',  cls: 'av-jo' },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="footer-accent" />

      <div className="footer-body">

        {/* Brand */}
        <div>
          <div className="footer-brand-logo">
            <div className="footer-brand-icon">
              <Shield size={14} strokeWidth={2.5} />
            </div>
            <span className="footer-brand-name">
              Medi<em>Guard</em> AI
            </span>
          </div>
          <p className="footer-brand-desc">
            Plataforma médica inteligente que pone la asistencia vital en tu bolsillo.
            Prevención, primeros auxilios y conexión con servicios de salud.
          </p>
          <span className="footer-badge">
            <span className="footer-badge-dot" />
            Proyecto Integrador — TECSUP 2026
          </span>
        </div>

        {/* Plataforma */}
        <div>
          <p className="footer-section-title">Plataforma</p>
          <ul className="footer-links">
            {PLATFORM.map(l => (
              <li key={l.href}>
                <a href={l.href} className="footer-link">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mi cuenta */}
        <div>
          <p className="footer-section-title">Mi cuenta</p>
          <ul className="footer-links">
            {ACCOUNT.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="footer-link">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Equipo Scrum */}
        <div>
          <p className="footer-section-title">Equipo Scrum</p>
          <ul className="footer-team-list">
            {TEAM.map(m => (
              <li key={m.name} className="footer-team-item">
                <div className={`footer-team-avatar ${m.cls}`}>{m.initials}</div>
                <div>
                  <p className="footer-team-name">{m.name}</p>
                  <p className="footer-team-role">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {year} MediGuard AI. Todos los derechos reservados.</span>
          <div className="footer-bottom-right">
            <span className="footer-bottom-dot" />
            <span>React · Spring Boot · IA — Proyecto Académico</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
