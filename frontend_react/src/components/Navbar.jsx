import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, LayoutDashboard, User, LogOut,
  Menu, X, Moon, Sun,
} from 'lucide-react';
import { authService } from '../services/authService';

const NAV_LINKS = [
  { label: 'La App',      href: '/#features' },
  { label: 'Beneficios',  href: '/#benefits' },
  { label: 'El Proyecto', href: '/#about' },
];

function Navbar({ hideNav = false }) {
  const [scrolled,   setScrolled]   = useState(false);
  const [isAuth,     setIsAuth]     = useState(authService.isAuthenticated());
  const [theme,      setTheme]      = useState(localStorage.getItem('theme') || 'light');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onAuth = () => setIsAuth(authService.isAuthenticated());
    window.addEventListener('auth-change', onAuth);
    return () => window.removeEventListener('auth-change', onAuth);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggleTheme  = () => setTheme(p => p === 'light' ? 'dark' : 'light');
  const handleLogout = async () => { await authService.logout(); navigate('/login', { replace: true }); };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>

        {/* Brand */}
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <span className="logo-text">
            Medi<em>Guard</em> AI
          </span>
        </Link>

        {/* Links centrados — solo en páginas públicas */}
        {!hideNav && (
          <div className="nav-links">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="nav-actions">

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="nav-theme-btn"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Auth buttons — ocultos en mobile vía CSS */}
          <div className="nav-auth-desktop">
            {isAuth ? (
              <>
                <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link to="/profile" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> Mi Perfil
                </Link>
                <button type="button" onClick={handleLogout} className="btn btn-emergency btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <LogOut size={14} /> Salir
                </button>
              </>
            ) : hideNav ? (
              pathname === '/login' ? (
                <Link to="/register" className="btn btn-primary btn-sm">Crear cuenta</Link>
              ) : (
                <Link to="/login" className="btn btn-outline btn-sm">Ingresar</Link>
              )
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Ingresar</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Crear cuenta</Link>
              </>
            )}
          </div>

          {/* Hamburger — visible solo en mobile vía CSS */}
          {!hideNav && (
            <button
              type="button"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Menú"
              className="nav-hamburger"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {!hideNav && (
        <div className={`nav-mobile-menu${mobileOpen ? ' open' : ''}`}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="nav-mobile-link">{l.label}</a>
          ))}

          <div className="nav-mobile-divider" />

          {isAuth ? (
            <>
              <Link to="/dashboard" className="nav-mobile-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link to="/profile" className="nav-mobile-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={14} /> Mi Perfil
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="nav-mobile-link danger"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit', fontSize: '0.9375rem', fontWeight: 500, textAlign: 'left' }}
              >
                <LogOut size={14} /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-mobile-link">Ingresar</Link>
              <Link to="/register" className="nav-mobile-link accent">Crear cuenta gratis</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
