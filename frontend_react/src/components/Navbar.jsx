import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">MediGuard AI</h2>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/login">Login</Link>
        <Link to="/registro">Registro</Link>
      </div>
    </nav>
  );
}

export default Navbar;