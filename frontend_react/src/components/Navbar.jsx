import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, LayoutDashboard, User, LogOut,
  Menu, X, Moon, Sun,
} from 'lucide-react';
import { authService } from '../services/authService';
import { useTheme } from '../hooks/useTheme';
import '../styles/Navbar.css';

const NAV_LINKS = [
  { label: 'Inicio',          href: '/',          section: 'inicio'   },
  { label: 'Nosotros',        href: '/#about',    section: 'about'    },
  { label: 'Guías',           href: '/#recursos', section: 'recursos' },
  { label: '¿Cuándo actuar?', href: '/#features', section: 'features' },
  { label: 'Misión',          href: '/#mision',   section: 'mision'   },
];

function Navbar({ hideNav = false }) {
  const [isAuth,     setIsAuth]     = useState(authService.isAuthenticated());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('inicio');
  const { theme, toggleTheme }      = useTheme();
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  // Marca la sección visible mientras se hace scroll (solo en el home).
  useEffect(() => {
    if (pathname !== '/') { setActiveHash(''); return; }
    const onScroll = () => {
      let current = 'inicio';
      for (const { section } of NAV_LINKS) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 90) current = section;
      }
      setActiveHash(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    const onAuth = () => setIsAuth(authService.isAuthenticated());
    window.addEventListener('auth-change', onAuth);
    return () => window.removeEventListener('auth-change', onAuth);
  }, []);

  const closeMobile = () => setMobileOpen(false);
  const handleLogout = async () => { await authService.logout(); navigate('/login', { replace: true }); };

  // Scroll suave a una sección, con reintentos por si el home aún no montó
  // tras navegar desde otra ruta. 'inicio' vuelve al tope de la página.
  const scrollToSection = (section, attempts = 0) => {
    if (section === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(section);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 76; // compensa navbar sticky
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else if (attempts < 25) {
      setTimeout(() => scrollToSection(section, attempts + 1), 60);
    }
  };

  const handleNav = (e, link) => {
    e.preventDefault();
    closeMobile();
    setActiveHash(link.section);
    if (pathname === '/') {
      scrollToSection(link.section);
    } else {
      navigate('/');
      scrollToSection(link.section);
    }
  };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="app-navbar sticky top-0 z-50 w-full flex items-center" style={{ height: '64px' }}>

        {/* Bloque 1 — Logo (izquierda) */}
        <Link to="/" onClick={(e) => handleNav(e, NAV_LINKS[0])} className="app-navbar-brand flex items-center gap-2 flex-shrink-0 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand)' }}>
            <Shield size={16} strokeWidth={2.5} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '-0.3px' }}>
            Medi<em style={{ fontStyle: 'normal', color: 'var(--brand)' }}>Guard</em> AI
          </span>
        </Link>

        {/* Bloque 2 — Links (centro) */}
        {!hideNav && (
          <div className="app-navbar-links flex-1 flex items-center justify-center">
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNav(e, l)}
                className={`app-nav-link${activeHash === l.section ? ' active' : ''}`}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

        {/* Spacer cuando hideNav=true para empujar acciones a la derecha */}
        {hideNav && <div className="flex-1" />}

        {/* Bloque 3 — Acciones (derecha) */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="app-nav-icon-btn"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Auth — desktop */}
          <div className="app-navbar-auth-desktop hidden md:flex items-center gap-1.5">
            {isAuth ? (
              <>
                <Link to="/dashboard" className={`app-nav-link${pathname === '/dashboard' ? ' active' : ''}`}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link to="/profile" className={`app-nav-link${pathname === '/profile' ? ' active' : ''}`}>
                  <User size={14} /> Mi Perfil
                </Link>
                <button type="button" onClick={handleLogout} className="app-nav-link app-nav-link-danger">
                  <LogOut size={14} /> Salir
                </button>
              </>
            ) : hideNav ? (
              pathname === '/login' ? (
                <Link to="/register" className="app-nav-cta app-nav-cta-solid">Crear cuenta</Link>
              ) : (
                <Link to="/login" className="app-nav-cta app-nav-cta-outline">Ingresar</Link>
              )
            ) : (
              <>
                <Link to="/login" className="app-nav-cta app-nav-cta-outline">Ingresar</Link>
                <Link to="/register" className="app-nav-cta app-nav-cta-solid">Crear cuenta</Link>
              </>
            )}
          </div>

          {/* Hamburger — solo mobile */}
          {!hideNav && (
            <button
              type="button"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Menú"
              className="app-navbar-menu-button app-nav-icon-btn md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {!hideNav && mobileOpen && (
        <div className="app-navbar-mobile-menu md:hidden fixed top-16 inset-x-0 z-40 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNav(e, l)}
              className={`app-nav-link app-nav-link-block${activeHash === l.section ? ' active' : ''}`}
            >
              {l.label}
            </a>
          ))}

          <div className="app-navbar-mobile-divider" />

          {isAuth ? (
            <>
              <Link to="/dashboard" onClick={closeMobile} className={`app-nav-link app-nav-link-block${pathname === '/dashboard' ? ' active' : ''}`}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link to="/profile" onClick={closeMobile} className={`app-nav-link app-nav-link-block${pathname === '/profile' ? ' active' : ''}`}>
                <User size={14} /> Mi Perfil
              </Link>
              <button type="button" onClick={handleLogout} className="app-nav-link app-nav-link-block app-nav-link-danger">
                <LogOut size={14} /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobile} className="app-nav-cta app-nav-cta-outline" style={{ justifyContent: 'center' }}>
                Ingresar
              </Link>
              <Link to="/register" onClick={closeMobile} className="app-nav-cta app-nav-cta-solid" style={{ justifyContent: 'center', marginTop: 6 }}>
                Crear cuenta gratis
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
