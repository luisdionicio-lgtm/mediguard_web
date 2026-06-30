import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Guides from '../pages/Guides';
import Hospitals from '../pages/Hospitals';
import News from '../pages/News';
import Profile from '../pages/Profile';
import Emergencies from '../pages/Emergencies';
import VerifyEmail from '../pages/VerifyEmail';
import Courses from '../pages/Courses';
import CourseDetail from '../pages/CourseDetail';
import CourseLearn from '../pages/CourseLearn';
import LearnGuide from '../pages/LearnGuide';
import PrivateRoute from '../components/PrivateRoute';
import AdminRoute from '../components/AdminRoute';
import { authService } from '../services/authService';

const AUTH_ROUTES    = ['/login', '/register', '/forgot-password', '/reset-password'];
const NO_SHELL_ROUTES = ['/admin/dashboard'];
const isLearnRoute   = (path) => /^\/courses\/[^/]+\/learn/.test(path);

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
  const isAuth    = AUTH_ROUTES.includes(pathname);
  const isAdmin   = NO_SHELL_ROUTES.some(r => pathname.startsWith(r));

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    );
  }

  if (isLearnRoute(pathname)) {
    return (
      <Routes>
        <Route path="/courses/:slug/learn" element={<PrivateRoute><CourseLearn /></PrivateRoute>} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar hideNav={isAuth} />

      {/* key={pathname} remonta el contenido en cada navegación para
          disparar la transición de entrada (.route-fade en global.css) */}
      <main key={pathname} className="route-fade" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />
          <Route path="/logout"      element={<LogoutRoute />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/guides"      element={<PrivateRoute><Guides /></PrivateRoute>} />
          <Route path="/hospitals"   element={<PrivateRoute><Hospitals /></PrivateRoute>} />
          <Route path="/news"        element={<PrivateRoute><News /></PrivateRoute>} />
          <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/emergencies" element={<PrivateRoute><Emergencies /></PrivateRoute>} />
          <Route path="/aprende/:slug" element={<LearnGuide />} />
          <Route path="/courses"       element={<PrivateRoute><Courses /></PrivateRoute>} />
          <Route path="/courses/:slug" element={<PrivateRoute><CourseDetail /></PrivateRoute>} />
        </Routes>
      </main>

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
