import { useState, useEffect } from 'react';
import './MobileMockup.css';

const screens = [
  { id: 0, type: 'home', bg: '#f8fafc', title: 'Inicio' },
  { id: 1, type: 'sos', bg: '#fee2e2', title: 'Emergencia' },
  { id: 2, type: 'guides', bg: '#f0fdfa', title: 'Guías' },
  { id: 3, type: 'triage', bg: '#f8fafc', title: 'Triaje' },
  { id: 4, type: 'map', bg: '#f8fafc', title: 'Mapa' },
  { id: 5, type: 'about', bg: '#f0fdfa', title: 'Nosotros' }
];

export default function MobileMockup() {
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % screens.length);
    }, 5000); // 5 seconds per screen
    return () => clearInterval(timer);
  }, []);

  const handleNavClick = (index) => {
    setCurrentScreen(index);
  };

  const renderScreenContent = (screen) => {
    switch(screen.type) {
      case 'home':
        return (
          <div className="app-screen-content home-screen">
            <div className="app-logo-area">
              <div className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              </div>
              <h2>MediGuard AI</h2>
            </div>
            <p className="app-welcome">Hola Luis, ¿En qué podemos ayudarte hoy?</p>
            
            <div className="quick-actions-grid">
              <div className="quick-action-btn sos" onClick={() => handleNavClick(1)}>
                <span className="action-icon">🚨</span>
                <span className="action-label">SOS</span>
              </div>
              <div className="quick-action-btn guide" onClick={() => handleNavClick(2)}>
                <span className="action-icon">📖</span>
                <span className="action-label">Guías</span>
              </div>
              <div className="quick-action-btn map" onClick={() => handleNavClick(4)}>
                <span className="action-icon">📍</span>
                <span className="action-label">Mapa</span>
              </div>
            </div>

            <div className="recent-activity">
              <h4>Último Triaje</h4>
              <p>Síntomas leves - Hace 2 días</p>
            </div>
          </div>
        );
      case 'sos':
        return (
          <div className="app-screen-content sos-screen">
            <div className="sos-pulse-container">
              <div className="sos-ripple"></div>
              <button className="sos-big-btn">SOS</button>
            </div>
            <p className="sos-alert-msg">Mantén presionado para alertar</p>
            
            <div className="sos-options">
              <button className="sos-btn fill">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                Llamar emergencia
              </button>
              <button className="sos-btn outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Enviar mi ubicación
              </button>
            </div>
          </div>
        );
      case 'guides':
        return (
          <div className="app-screen-content guides-screen">
            <div className="app-screen-header">
              <h3>Primeros Auxilios</h3>
              <p>Guías interactivas paso a paso</p>
            </div>
            <div className="guide-item" style={{marginTop: '15px'}}>
              <div className="guide-icon-box">🔥</div>
              <div className="guide-info">
                <h4>Quemaduras</h4>
                <div className="guide-steps">
                  <span className="step-dot"></span><span className="step-dot"></span><span className="step-dot"></span><span className="step-dot empty"></span>
                </div>
              </div>
              <button className="guide-view-btn">Ver</button>
            </div>
            <div className="guide-item">
              <div className="guide-icon-box">🩸</div>
              <div className="guide-info">
                <h4>Hemorragias</h4>
                <div className="guide-steps">
                  <span className="step-dot"></span><span className="step-dot"></span><span className="step-dot empty"></span>
                </div>
              </div>
              <button className="guide-view-btn">Ver</button>
            </div>
            <div className="guide-item">
              <div className="guide-icon-box">😵</div>
              <div className="guide-info">
                <h4>Desmayo</h4>
                <div className="guide-steps">
                  <span className="step-dot"></span><span className="step-dot"></span><span className="step-dot"></span>
                </div>
              </div>
              <button className="guide-view-btn">Ver</button>
            </div>
          </div>
        );
      case 'triage':
        return (
          <div className="app-screen-content triage-screen">
            <div className="app-screen-header">
              <h3>Triaje IA</h3>
              <p>Evaluación rápida de síntomas</p>
            </div>
            <div className="triage-chat" style={{marginTop: '15px'}}>
              <div className="chat-bubble bot">
                Hola, soy tu asistente médico. ¿Qué síntoma principal presentas?
              </div>
              <div className="triage-options">
                <span className="triage-chip">Fiebre alta</span>
                <span className="triage-chip" style={{background: 'var(--teal-primary)', color: 'white'}}>Dolor de pecho</span>
                <span className="triage-chip">Mareos</span>
              </div>
              <div className="chat-bubble user">
                Tengo un fuerte dolor de pecho y me cuesta respirar un poco.
              </div>
              <div className="chat-result">
                <span>⚠️</span>
                <div>Resultado: <strong>Grave</strong><br/>Busca atención médica de inmediato.</div>
              </div>
            </div>
          </div>
        );
      case 'map':
        return (
          <div className="app-screen-content map-screen">
             <div className="map-bg"></div>
             <div className="map-marker hospital">
                <div className="hospital-icon">🏥</div>
             </div>
             <div className="map-marker user">
                <div className="user-pulse"></div>
                <div className="user-dot"></div>
             </div>
             
             <div className="map-bottom-sheet">
               <h4>Hospital General Universitario</h4>
               <p>🏥 Urgencias 24h • A 2.5 km de distancia</p>
               <button className="route-btn">Ver ruta óptima</button>
             </div>
          </div>
        );
      case 'about':
        return (
          <div className="app-screen-content about-screen">
             <div className="about-hero">
                <div className="about-logo-big">🛡️</div>
                <h2>MediGuard AI</h2>
                <p>Democratizando el acceso a la salud y reduciendo los tiempos de respuesta en emergencias vitales.</p>
             </div>
             
             <div className="team-section">
               <h4>Equipo Desarrollador</h4>
               <div className="team-list">
                 <div className="team-member">
                   <div className="member-avatar">LD</div>
                   <div className="member-info">
                     <h5>Luis Dionicio</h5>
                     <span>Frontend Developer</span>
                   </div>
                 </div>
                 <div className="team-member">
                   <div className="member-avatar">RQ</div>
                   <div className="member-info">
                     <h5>Rony Quintana</h5>
                     <span>Mobile Developer</span>
                   </div>
                 </div>
                 <div className="team-member">
                   <div className="member-avatar">JO</div>
                   <div className="member-info">
                     <h5>Jeronimo Ortiz</h5>
                     <span>Backend Developer</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="mobile-mockup-container">
      <div className="mobile-mockup">
        {/* Hardware details */}
        <div className="mobile-notch">
           <div className="mobile-camera"></div>
           <div className="mobile-speaker"></div>
        </div>
        <div className="mobile-power-button"></div>
        <div className="mobile-volume-up"></div>
        <div className="mobile-volume-down"></div>

        <div className="mobile-screen">
          <div className="mobile-header">
            <span className="time">9:41</span>
            <div className="icons">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="16" height="10" rx="2" ry="2"/><line x1="22" y1="11" x2="22" y2="13"/></svg>
            </div>
          </div>

          <div className="carousel-container">
            {screens.map((screen, index) => (
              <div 
                key={screen.id} 
                className={`carousel-slide ${index === currentScreen ? 'active' : ''}`}
                style={{ backgroundColor: screen.bg, padding: 0 }}
              >
                {renderScreenContent(screen)}
              </div>
            ))}
          </div>

          <div className="mobile-nav-v2">
             <button className={`nav-btn ${currentScreen === 0 ? 'active' : ''}`} onClick={() => handleNavClick(0)}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
               <span>Inicio</span>
             </button>
             <button className={`nav-btn ${currentScreen === 3 ? 'active' : ''}`} onClick={() => handleNavClick(3)}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
               <span>Triaje</span>
             </button>
             <button className={`nav-btn ${currentScreen === 1 ? 'active' : ''}`} style={{ color: currentScreen === 1 ? 'var(--red-emergency)' : 'var(--red-hover)' }} onClick={() => handleNavClick(1)}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>
               <span>SOS</span>
             </button>
             <button className={`nav-btn ${currentScreen === 4 ? 'active' : ''}`} onClick={() => handleNavClick(4)}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               <span>Mapa</span>
             </button>
             <button className={`nav-btn ${(currentScreen === 2 || currentScreen === 5) ? 'active' : ''}`} onClick={() => handleNavClick(5)}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
               <span>Más</span>
             </button>
          </div>
          {/* Home Indicator */}
          <div className="mobile-home-indicator"></div>
        </div>
      </div>
      
      {/* Carousel dots indicator outside the phone */}
      <div className="carousel-indicators">
        {screens.map((_, idx) => (
          <div key={idx} className={`dot ${idx === currentScreen ? 'active' : ''}`} onClick={() => setCurrentScreen(idx)}></div>
        ))}
      </div>
    </div>
  );
}
