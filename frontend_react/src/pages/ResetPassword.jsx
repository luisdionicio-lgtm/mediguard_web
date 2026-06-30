import { useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { authService } from '../services/authService';
import { getApiErrorMessage } from '../services/errorService';
import AuthBackground from '../components/AuthBackground';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwErr, setPwErr] = useState('');
  const [confirmErr, setConfirmErr] = useState('');
  const [tokenErr, setTokenErr] = useState('');
  const [btnState, setBtnState] = useState('idle');

  const btnRef = useRef(null);

  const passwordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword;
  const canSubmit = !!token && passwordValid && passwordsMatch;

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
    setPwErr(''); setConfirmErr(''); setTokenErr('');

    if (!passwordValid) {
      setPwErr('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (!passwordsMatch) {
      setConfirmErr('Las contraseñas no coinciden.');
      return;
    }

    triggerRipple(e);
    setBtnState('loading');
    try {
      await authService.resetPassword(token, password);
      setBtnState('success');
      setTimeout(() => navigate('/login', {
        state: { successMessage: 'Contraseña actualizada. Inicia sesión con tu nueva contraseña.' },
      }), 1100);
    } catch (err) {
      setBtnState('idle');
      if (!err.response) {
        setTokenErr('No se pudo conectar con el servidor. Verifica que el backend esté activo.');
        return;
      }
      setTokenErr(getApiErrorMessage(err, 'El enlace no es válido o ya expiró.'));
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

            <h1 className="auth-form-title">Restablecer contraseña</h1>
            <p className="auth-form-sub">Elige una nueva contraseña para tu cuenta.</p>

            {!token && (
              <div className="auth-field-error show" style={{ marginBottom: 12 }}>
                Este enlace no incluye un token válido. Solicita uno nuevo desde
                {' '}<Link to="/forgot-password">recuperar contraseña</Link>.
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label className="auth-label">Nueva contraseña</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-lock auth-input-icon" />
                  <input
                    className={`auth-input${pwErr ? ' is-error' : ''}${btnState === 'success' ? ' is-success' : ''}`}
                    type={showPw ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    autoComplete="new-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setPwErr(''); }}
                    disabled={!token}
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPw(p => !p)} tabIndex={-1} aria-label={showPw ? 'Ocultar' : 'Mostrar'}>
                    <i className={showPw ? 'ti ti-eye-off' : 'ti ti-eye'} />
                  </button>
                </div>
                <span className={`auth-field-error${pwErr ? ' show' : ''}`}>{pwErr}</span>
              </div>

              <div className="auth-field">
                <label className="auth-label">Confirmar contraseña</label>
                <div className="auth-input-wrap">
                  <i className="ti ti-lock auth-input-icon" />
                  <input
                    className={`auth-input${confirmErr ? ' is-error' : ''}${btnState === 'success' ? ' is-success' : ''}`}
                    type={showPw ? 'text' : 'password'}
                    placeholder="Repite la contraseña"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setConfirmErr(''); }}
                    disabled={!token}
                  />
                </div>
                <span className={`auth-field-error${confirmErr ? ' show' : ''}`}>{confirmErr}</span>
              </div>

              <span className={`auth-field-error${tokenErr ? ' show' : ''}`} style={{ display: 'block', marginBottom: 12 }}>{tokenErr}</span>

              <button
                ref={btnRef}
                type="submit"
                className={`auth-submit${btnState === 'success' ? ' is-success' : ''}`}
                disabled={!canSubmit || btnState === 'loading' || btnState === 'success'}
              >
                {btnState === 'loading' && <><span className="auth-spinner" />Actualizando…</>}
                {btnState === 'success' && <><i className="ti ti-circle-check" style={{ fontSize: 17 }} />¡Contraseña actualizada!</>}
                {btnState === 'idle' && <>Restablecer contraseña →</>}
              </button>
            </form>

            <p className="auth-switch">
              <Link to="/login">← Volver a iniciar sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
