import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

function Navbar({ hideNav = false }) {
  const [scrolled, setScrolled]           = useState(false);
  const [isAuth, setIsAuth]               = useState(authService.isAuthenticated());
  const [theme, setTheme]                 = useState(localStorage.getItem('theme') || 'light');
  const [mobileOpen, setMobileOpen]       = useState(false);
  const navigate   = useNavigate();
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

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggleTheme  = () => setTheme(p => p === 'light' ? 'dark' : 'light');
  const handleLogout = async () => { await authService.logout(); navigate('/login', { replace: true }); };

  const navLinks = [
    { label: 'La App',       href: '/#features' },
    { label: 'Beneficios',   href: '/#benefits' },
    { label: 'El Proyecto',  href: '/#about' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="logo-text">Medi<em>Guard</em> AI</span>
        </Link>

        {/* Center links — hidden on auth pages */}
        {!hideNav && (
          <div className="nav-links">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="nav-actions">
          {/* Theme toggle */}
          <button
            className="nav-theme-btn"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            type="button"
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {isAuth ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
              </Link>
              <Link to="/profile" className="btn btn-outline btn-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Mi Perfil
              </Link>
              <button type="button" className="btn btn-emergency btn-sm" onClick={handleLogout}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Salir
              </button>
            </>
          ) : hideNav ? (
            /* On auth pages: minimal actions */
            pathname === '/login' ? (
              <Link to="/register" className="btn btn-primary btn-sm">Crear cuenta</Link>
            ) : (
              <Link to="/login" className="btn btn-outline btn-sm">Ingresar</Link>
            )
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Ingresar</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Crear cuenta</Link>
            </>
          )}

          {/* Hamburger — only for public pages */}
          {!hideNav && (
            <button
              className="nav-hamburger"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Menú"
              type="button"
            >
              {mobileOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {!hideNav && (
        <div className={`nav-mobile-menu${mobileOpen ? ' open' : ''}`}>
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className="nav-mobile-link">{l.label}</a>
          ))}
          <div className="nav-mobile-divider" />
          {isAuth ? (
            <>
              <Link to="/dashboard" className="nav-mobile-link">Dashboard</Link>
              <Link to="/profile"   className="nav-mobile-link">Mi Perfil</Link>
              <button type="button" className="nav-mobile-link" style={{ border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--error)' }} onClick={handleLogout}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-mobile-link">Ingresar</Link>
              <Link to="/register" className="nav-mobile-link" style={{ color: 'var(--brand)', fontWeight: 600 }}>Crear cuenta gratis</Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
