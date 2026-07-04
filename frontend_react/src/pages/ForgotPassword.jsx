import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { authService } from '../services/authService';
import AuthBackground from '../components/AuthBackground';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [btnState, setBtnState] = useState('idle');
  const [sent, setSent] = useState(false);

  const btnRef = useRef(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const triggerRipple = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    const el = document.createElement('span');
    el.className = 'auth-ripple';
    el.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px;`;
    btn.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid || btnState === 'loading') return;
    setEmailErr('');
    triggerRipple(e);
    setBtnState('loading');

    try {
      await authService.forgotPassword(email.trim());
      setBtnState('success');
      setSent(true);
    } catch (err) {
      setBtnState('idle');
      if (!err.response) {
        setEmailErr('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
        return;
      }
      // El backend siempre responde 200 con mensaje genérico (anti-enumeración);
      // un error aquí solo puede ser de formato de correo o de red.
      setEmailErr('El formato del correo no es válido.');
    }
  };

  return (
    <div className="auth-page">
      <AuthBackground />
      <div className="auth-wrapper" style={{ gridTemplateColumns: '1fr', maxWidth: 460 }}>
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18, justifyContent: 'center' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--brand)' }}>
                <Shield size={16} strokeWidth={2.5} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '-0.3px' }}>
                Medi<em style={{ fontStyle: 'normal', color: 'var(--brand)' }}>Guard</em> AI
              </span>
            </div>

            <h1 className="auth-form-title">¿Olvidaste tu contraseña?</h1>
            <p className="auth-form-sub">
              Ingresa tu correo y te enviaremos un enlace para restablecerla.
            </p>

            {sent ? (
              <div className="auth-success-banner">
                <i className="ti ti-circle-check" style={{ fontSize: 15 }} />
                Si el correo está registrado, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada (y spam).
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="auth-field">
                  <label className="auth-label">Correo electrónico</label>
                  <div className="auth-input-wrap">
                    <i className="ti ti-mail auth-input-icon" />
                    <input
                      className={`auth-input${emailErr ? ' is-error' : ''}`}
                      type="email"
                      placeholder="ana@correo.com"
                      autoComplete="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailErr(''); }}
                      autoFocus
                    />
                  </div>
                  <span className={`auth-field-error${emailErr ? ' show' : ''}`}>{emailErr}</span>
                </div>

                <button
                  ref={btnRef}
                  type="submit"
                  className="auth-submit"
                  disabled={!emailValid || btnState === 'loading'}
                  style={{ marginTop: 6 }}
                >
                  {btnState === 'loading' && <><span className="auth-spinner" />Enviando…</>}
                  {btnState === 'idle' && <>Enviar enlace de recuperación →</>}
                </button>
              </form>
            )}

            <p className="auth-switch">
              <Link to="/login">← Volver a iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
