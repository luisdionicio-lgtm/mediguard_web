import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-brand">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#CCFBF1"/>
          <path d="M15 11H13V9C13 8.44772 12.5523 8 12 8C11.4477 8 11 8.44772 11 9V11H9C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H11V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11Z" fill="#0D9488"/>
        </svg>
        <Link to="/" className="logo-text">MediGuard AI</Link>
      </div>

      <div className="nav-links">
        <a href="/#features" className="nav-link">La App</a>
        <a href="/#benefits" className="nav-link">Beneficios</a>
        <a href="/#about" className="nav-link">El Proyecto</a>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="btn btn-secondary">Ingresar</Link>
        <Link to="/registro" className="btn btn-primary">Crear Cuenta</Link>
      </div>
    </nav>
  );
}

export default Navbar;