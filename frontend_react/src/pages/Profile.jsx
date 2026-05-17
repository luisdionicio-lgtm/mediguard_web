import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import '../styles/Profile.css';

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

  if (!profile) {
    return (
      <div className="profile-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="animate-fade-in">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="badge-pulse"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
        </div>
      </div>
    );
  }

  const nameToDisplay = profile.nombre ? profile.nombre : `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const initials = nameToDisplay ? nameToDisplay.substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="profile-container animate-fade-in">
      <div className="profile-header">
        <div className="profile-avatar">
          {initials}
        </div>
        <div className="profile-title">
          <h1>{nameToDisplay}</h1>
          <p>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            {profile.email}
          </p>
        </div>
        <div className="profile-badge">
          {profile.roles ? profile.roles.join(', ') : 'Paciente Premium'}
        </div>
      </div>

      <div className="profile-grid">
        {/* Section: Personal Info */}
        <div className="profile-section">
          <div className="profile-section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <h2>Información Personal</h2>
          </div>
          <ul className="info-list">
            <li>
              <span className="info-label">Nombre Completo</span>
              <span className="info-value">{nameToDisplay}</span>
            </li>
            <li>
              <span className="info-label">Teléfono</span>
              <span className="info-value">{profile.phone || '+51 987 654 321'}</span>
            </li>
            <li>
              <span className="info-label">Fecha de Nacimiento</span>
              <span className="info-value">15 / 08 / 1990</span>
            </li>
            <li>
              <span className="info-label">Tipo de Sangre</span>
              <span className="info-value" style={{color: 'var(--red-emergency)'}}>O+</span>
            </li>
          </ul>
        </div>

        {/* Section: Emergency Contacts */}
        <div className="profile-section">
          <div className="profile-section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red-emergency)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92z"></path></svg>
            <h2>Contactos de Emergencia</h2>
          </div>
          <ul className="info-list">
            <li>
              <span className="info-label">María Pérez (Madre)</span>
              <span className="info-value">+51 912 345 678</span>
            </li>
            <li>
              <span className="info-label">Carlos Gómez (Hermano)</span>
              <span className="info-value">+51 998 877 665</span>
            </li>
          </ul>
          <button className="btn btn-outline-white" style={{borderColor: 'var(--gray-200)', color: 'var(--blue-deep)', width: '100%', marginTop: '1rem'}}>
            + Añadir Contacto
          </button>
        </div>

        {/* Section: Health Status */}
        <div className="profile-section" style={{ gridColumn: '1 / -1' }}>
          <div className="profile-section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <h2>Estado de Salud General</h2>
          </div>
          <div className="health-status-cards">
            <div className="status-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
              <div className="status-card-value">72 <span style={{fontSize: '1rem', color: 'var(--blue-light)'}}>bpm</span></div>
              <div className="status-card-label">Ritmo Cardíaco</div>
            </div>
            <div className="status-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              <div className="status-card-value">120/80</div>
              <div className="status-card-label">Presión Arterial</div>
            </div>
            <div className="status-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
              <div className="status-card-value">Ninguna</div>
              <div className="status-card-label">Alergias Registradas</div>
            </div>
            <div className="status-card">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <div className="status-card-value">Limpio</div>
              <div className="status-card-label">Historial Médico</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
