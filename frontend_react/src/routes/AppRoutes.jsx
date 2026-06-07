import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Guides from '../pages/Guides';
import Hospitals from '../pages/Hospitals';
import News from '../pages/News';
import Profile from '../pages/Profile';
import Emergencies from '../pages/Emergencies';
import PrivateRoute from '../components/PrivateRoute';
import { authService } from '../services/authService';

const AUTH_ROUTES = ['/login', '/register'];

function LogoutRoute() {
  const navigate = useNavigate();
  useEffect(() => {
    const closeSession = async () => {
      await authService.logout();
      navigate('/login', { replace: true });
    };
    closeSession();
  }, [navigate]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);

  return (
    <>
      <Navbar hideNav={isAuth} />

      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout"   element={<LogoutRoute />} />

        <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/guides"     element={<PrivateRoute><Guides /></PrivateRoute>} />
        <Route path="/hospitals"  element={<PrivateRoute><Hospitals /></PrivateRoute>} />
        <Route path="/news"       element={<PrivateRoute><News /></PrivateRoute>} />
        <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/emergencies" element={<PrivateRoute><Emergencies /></PrivateRoute>} />
      </Routes>

      {!isAuth && <Footer />}
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default AppRoutes;
