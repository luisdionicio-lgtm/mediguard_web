import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import '../styles/Dashboard.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile", error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="simple-page-container">
      <h1 className="section-title">Mi <span className="highlight">Perfil</span></h1>
      <div className="dashboard-card dark" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', alignItems: 'center' }}>
        <div className="card-icon" style={{ fontSize: '4rem' }}>👤</div>
        {profile ? (
          <>
            <h3 style={{ fontSize: '2rem', marginBottom: '10px' }}>{profile.first_name} {profile.last_name}</h3>
            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>{profile.email}</p>
            <p style={{ color: '#0D9488', fontWeight: 'bold' }}>Rol: {profile.roles ? profile.roles.join(', ') : 'Usuario'}</p>
          </>
        ) : (
          <p>Cargando información del perfil...</p>
        )}
      </div>
    </div>
  );
};
export default Profile;
