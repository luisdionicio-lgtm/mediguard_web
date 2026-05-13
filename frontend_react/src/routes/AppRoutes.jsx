import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import PrivateRoute from '../components/PrivateRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        
        {/* Rutas Privadas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/guides" element={<PrivateRoute><Guides /></PrivateRoute>} />
        <Route path="/hospitals" element={<PrivateRoute><Hospitals /></PrivateRoute>} />
        <Route path="/news" element={<PrivateRoute><News /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default AppRoutes;