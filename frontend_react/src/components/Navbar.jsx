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

  useEffect(() => {
    const onScroll = () => {
      if (pathname !== '/') return;
      let current = 'inicio';
      for (const { section } of NAV_LINKS) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 80) current = section;
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

  const closeMobile  = () => setMobileOpen(false);
  const handleLogout = async () => { await authService.logout(); navigate('/login', { replace: true }); };

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav style={{ height: '64px' }} className="app-navbar sticky top-0 z-50 w-full flex items-center bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">

        {/* Bloque 1 — Logo (izquierda) */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand)' }}>
            <Shield size={16} strokeWidth={2.5} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '-0.3px' }}>
            Medi<em style={{ fontStyle: 'normal', color: 'var(--brand)' }}>Guard</em> AI
          </span>
        </Link>

        {/* Bloque 2 — Links (centro, flex-1 para ocupar todo el espacio disponible) */}
        {!hideNav && (
          <div className="app-navbar-links flex-1 flex items-center justify-center gap-8">
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={
                  activeHash === l.section
                    ? 'px-3 py-2 rounded-md text-sm font-semibold bg-emerald-50 text-emerald-700 transition-colors duration-200'
                    : 'px-3 py-2 rounded-md text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-700'
                }
                style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}

        {/* Spacer cuando hideNav=true para empujar acciones a la derecha */}
        {hideNav && <div className="flex-1" />}

        {/* Bloque 3 — Acciones (derecha) */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="p-2 rounded-md text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Auth — desktop */}
          <div className="app-navbar-auth-desktop hidden md:flex items-center gap-2">
            {isAuth ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-700"
                  style={{ textDecoration: 'none' }}
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-emerald-50 hover:text-emerald-700"
                  style={{ textDecoration: 'none' }}
                >
                  <User size={14} /> Mi Perfil
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-red-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut size={14} /> Salir
                </button>
              </>
            ) : hideNav ? (
              pathname === '/login' ? (
                <Link to="/register" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '7px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: '#fff', background: '#059669', border: '1.5px solid #059669', boxShadow: '0 2px 12px rgba(5,150,105,0.35)' }}>
                  Crear cuenta
                </Link>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '7px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#059669', border: '1.5px solid #6EE7B7', boxShadow: '0 2px 10px rgba(52,211,153,0.18)' }}>
                  Ingresar
                </Link>
              )
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '7px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#059669', border: '1.5px solid #6EE7B7', boxShadow: '0 2px 10px rgba(52,211,153,0.18)' }}>
                  Ingresar
                </Link>
                <Link to="/register" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '7px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: '#fff', background: '#059669', border: '1.5px solid #059669', boxShadow: '0 2px 12px rgba(5,150,105,0.35)' }}>
                  Crear cuenta
                </Link>
              </>
            )}
          </div>

          {/* Hamburger — solo mobile */}
          {!hideNav && (
            <button
              type="button"
              onClick={() => setMobileOpen(p => !p)}
              aria-label="Menú"
              className="app-navbar-menu-button md:hidden p-2 rounded-md text-gray-500 transition-colors duration-200 hover:bg-gray-100"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {!hideNav && mobileOpen && (
        <div className="app-navbar-mobile-menu md:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-gray-200 shadow-lg px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              onClick={closeMobile}
              style={{ textDecoration: 'none' }}
              className={
                activeHash === l.section
                  ? 'px-3 py-2 rounded-md text-sm font-semibold bg-emerald-50 text-emerald-700'
                  : 'px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200'
              }
            >
              {l.label}
            </a>
          ))}

          <div className="h-px bg-gray-100 my-1" />

          {isAuth ? (
            <>
              <Link to="/dashboard" onClick={closeMobile} style={{ textDecoration: 'none' }} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link to="/profile" onClick={closeMobile} style={{ textDecoration: 'none' }} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-200">
                <User size={14} /> Mi Perfil
              </Link>
              <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 w-full text-left">
                <LogOut size={14} /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMobile} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', padding: '8px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, color: '#059669', border: '1.5px solid #6EE7B7', boxShadow: '0 2px 10px rgba(52,211,153,0.18)' }}>
                Ingresar
              </Link>
              <Link to="/register" onClick={closeMobile} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 6, padding: '8px 18px', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 700, color: '#fff', background: '#059669', border: '1.5px solid #059669', boxShadow: '0 2px 12px rgba(5,150,105,0.35)' }}>
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
