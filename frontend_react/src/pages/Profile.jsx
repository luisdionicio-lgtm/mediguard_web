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
          Estudiante / Ciudadano
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
              <span className="info-value">{profile.phone || 'No registrado'}</span>
            </li>
            <li>
              <span className="info-label">Miembro desde</span>
              <span className="info-value">Reciente</span>
            </li>
          </ul>
        </div>

        {/* Section: Learning Progress */}
        <div className="profile-section">
          <div className="profile-section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--teal-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            <h2>Mi Progreso Educativo</h2>
          </div>
          <ul className="info-list">
            <li>
              <span className="info-label">Cursos Completados</span>
              <span className="info-value">0</span>
            </li>
            <li>
              <span className="info-label">Certificados Obtenidos</span>
              <span className="info-value">Ninguno</span>
            </li>
            <li>
              <span className="info-label">Guías Leídas</span>
              <span className="info-value">2</span>
            </li>
          </ul>
          <button className="btn" style={{backgroundColor: 'transparent', border: '1px solid var(--teal-primary)', color: 'var(--teal-primary)', width: '100%', marginTop: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontWeight: '600', transition: 'all 0.3s'}} onMouseOver={(e) => {e.target.style.backgroundColor='var(--teal-primary)'; e.target.style.color='white'}} onMouseOut={(e) => {e.target.style.backgroundColor='transparent'; e.target.style.color='var(--teal-primary)'}}>
            Ver Historial de Cursos
          </button>
        </div>

        {/* Section: Emergency Contacts */}
        <div className="profile-section" style={{ gridColumn: '1 / -1' }}>
          <div className="profile-section-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red-emergency)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92z"></path></svg>
            <h2>Mis Contactos de Emergencia</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ padding: '1.25rem', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <p style={{ fontWeight: '700', color: 'var(--blue-deep)', margin: '0 0 0.25rem 0' }}>María Pérez</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--blue-light)', margin: 0 }}>Madre</p>
              </div>
              <span style={{ color: 'var(--teal-primary)', fontWeight: '600', backgroundColor: 'var(--teal-surface)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}>+51 912 345 678</span>
            </div>
            <div style={{ padding: '1.25rem', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--white)', boxShadow: 'var(--shadow-sm)' }}>
              <div>
                <p style={{ fontWeight: '700', color: 'var(--blue-deep)', margin: '0 0 0.25rem 0' }}>Carlos Gómez</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--blue-light)', margin: 0 }}>Hermano</p>
              </div>
              <span style={{ color: 'var(--teal-primary)', fontWeight: '600', backgroundColor: 'var(--teal-surface)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}>+51 998 877 665</span>
            </div>
          </div>
          <button className="btn" style={{backgroundColor: 'transparent', border: '1px solid var(--gray-300)', color: 'var(--blue-deep)', marginTop: '2rem', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '600', transition: 'all 0.3s'}} onMouseOver={(e) => {e.target.style.backgroundColor='var(--gray-100)'}} onMouseOut={(e) => {e.target.style.backgroundColor='transparent'}}>
            + Añadir Nuevo Contacto
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
