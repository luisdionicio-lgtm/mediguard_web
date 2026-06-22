/* Fondo animado para páginas de auth — elementos flotantes fuera del card */
export default function AuthBackground() {
  return (
    <div className="auth-bg-layer" aria-hidden="true">

      {/* ── ESQUINA SUPERIOR IZQUIERDA — Cruz grande + ondas ── */}
      <svg className="auth-bg-corner auth-bg-corner--tl" width="200" height="200" viewBox="0 0 200 200" fill="none">
        {/* Cruz primeros auxilios */}
        <rect x="72" y="30" width="24" height="70" rx="8" fill="#DC2626" opacity="0.18">
          <animate attributeName="opacity" values="0.18;0.08;0.18" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="42" y="60" width="84" height="24" rx="8" fill="#DC2626" opacity="0.18">
          <animate attributeName="opacity" values="0.18;0.08;0.18" dur="3s" repeatCount="indefinite" />
        </rect>
        {/* Ondas concéntricas */}
        {[40,60,80].map((r,i) => (
          <circle key={i} cx="84" cy="65" r={r} stroke="#4ADE80" strokeWidth="1" fill="none" opacity="0">
            <animate attributeName="r"       values={`${r};${r+28};${r}`} dur={`${3+i}s`} repeatCount="indefinite" begin={`${i*0.9}s`} />
            <animate attributeName="opacity" values="0;0.18;0"            dur={`${3+i}s`} repeatCount="indefinite" begin={`${i*0.9}s`} />
          </circle>
        ))}
      </svg>

      {/* ── ESQUINA SUPERIOR DERECHA — Sirena + destellos ── */}
      <svg className="auth-bg-corner auth-bg-corner--tr" width="180" height="180" viewBox="0 0 180 180" fill="none">
        {/* Cuerpo sirena */}
        <rect x="100" y="40" width="52" height="28" rx="14" fill="#1D4ED8" opacity="0.25" />
        {/* Luz izquierda */}
        <circle cx="114" cy="54" r="10" fill="#EF4444" opacity="0.35">
          <animate attributeName="opacity" values="0.35;0.05;0.35" dur="0.6s" repeatCount="indefinite" />
        </circle>
        {/* Luz derecha */}
        <circle cx="138" cy="54" r="10" fill="#3B82F6" opacity="0.05">
          <animate attributeName="opacity" values="0.05;0.35;0.05" dur="0.6s" repeatCount="indefinite" />
        </circle>
        {/* Destello rojo irradiado */}
        <circle cx="114" cy="54" r="10" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0">
          <animate attributeName="r"       values="10;32;10"   dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4"  dur="0.6s" repeatCount="indefinite" />
        </circle>
        {/* Destello azul irradiado */}
        <circle cx="138" cy="54" r="10" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0">
          <animate attributeName="r"       values="10;32;10"   dur="0.6s" repeatCount="indefinite" begin="0.3s" />
          <animate attributeName="opacity" values="0;0.4;0"    dur="0.6s" repeatCount="indefinite" begin="0.3s" />
        </circle>
        {/* SOS badge */}
        <circle cx="148" cy="110" r="20" fill="#DC2626" opacity="0.2">
          <animate attributeName="r"       values="20;28;20"   dur="1.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="148" cy="110" r="14" fill="#DC2626" opacity="0.3" />
        <text x="148" y="115" textAnchor="middle" fontSize="9" fontWeight="900"
          fontFamily="system-ui,sans-serif" fill="#fff" opacity="0.7">SOS</text>
      </svg>

      {/* ── ESQUINA INFERIOR IZQUIERDA — ECG larga ── */}
      <svg className="auth-bg-corner auth-bg-corner--bl" width="240" height="120" viewBox="0 0 240 120" fill="none">
        <polyline
          points="0,80 20,80 28,58 36,102 44,44 52,80 72,80 80,68 88,92 96,80 120,80 128,62 136,98 144,50 152,80 172,80 178,72 184,88 190,80 240,80"
          stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.25"
        >
          <animate attributeName="stroke-dasharray" from="0 600" to="600 0" dur="3s" repeatCount="indefinite" />
        </polyline>
        <line x1="0" y1="80" x2="240" y2="80" stroke="rgba(74,222,128,0.07)" strokeWidth="1" />
        <circle cx="240" cy="80" r="4" fill="#4ADE80" opacity="0.3">
          <animate attributeName="r"       values="4;8;4"      dur="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0.05;0.3" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* ── ESQUINA INFERIOR DERECHA — Escudo Defensa Civil ── */}
      <svg className="auth-bg-corner auth-bg-corner--br" width="160" height="180" viewBox="0 0 160 180" fill="none">
        <path d="M80 10 L148 38 L148 90 Q148 148 80 170 Q12 148 12 90 L12 38 Z" fill="#1D4ED8" opacity="0.10">
          <animate attributeName="opacity" values="0.10;0.04;0.10" dur="3s" repeatCount="indefinite" />
        </path>
        <path d="M80 10 L148 38 L148 90 Q148 148 80 170 Q12 148 12 90 L12 38 Z"
          fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.20">
          <animate attributeName="opacity" values="0.20;0.06;0.20" dur="3s" repeatCount="indefinite" />
        </path>
        {/* Cruz interior */}
        <rect x="74" y="55" width="12" height="52" rx="4" fill="#fff" opacity="0.12" />
        <rect x="52" y="74" width="56" height="12" rx="4" fill="#fff" opacity="0.12" />
        <text x="80" y="138" textAnchor="middle" fontSize="8" fontWeight="700"
          fontFamily="system-ui,sans-serif" fill="#60A5FA" opacity="0.4" letterSpacing="1">DEFENSA CIVIL</text>
      </svg>

      {/* ── LATERAL IZQUIERDO — Corazón flotante ── */}
      <svg className="auth-bg-side auth-bg-side--l" width="60" height="300" viewBox="0 0 60 300" fill="none">
        {/* Corazón superior */}
        <g transform="translate(30,70)">
          <path d="M0 8 C0 2 -9 -4 -14 1 C-19 6 -14 16 0 26 C14 16 19 6 14 1 C9 -4 0 2 0 8Z"
            fill="#EF4444" opacity="0.25">
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.10;0.25" dur="2.4s" repeatCount="indefinite" />
          </path>
        </g>
        {/* Línea vertical punteada */}
        <line x1="30" y1="0" x2="30" y2="300" stroke="#4ADE80" strokeWidth="1" strokeDasharray="4 10" opacity="0.12" />
        {/* Corazón inferior */}
        <g transform="translate(30,220)">
          <path d="M0 6 C0 1 -7 -3 -11 1 C-15 5 -11 13 0 20 C11 13 15 5 11 1 C7 -3 0 1 0 6Z"
            fill="#DC2626" opacity="0.20">
            <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="2s" repeatCount="indefinite" begin="1s" />
            <animate attributeName="opacity" values="0.20;0.07;0.20" dur="2s" repeatCount="indefinite" begin="1s" />
          </path>
        </g>
      </svg>

      {/* ── LATERAL DERECHO — Cruz + partículas ── */}
      <svg className="auth-bg-side auth-bg-side--r" width="60" height="300" viewBox="0 0 60 300" fill="none">
        {/* Cruz pequeña superior */}
        <rect x="23" y="50" width="14" height="40" rx="4" fill="#DC2626" opacity="0.18">
          <animate attributeName="opacity" values="0.18;0.06;0.18" dur="2.8s" repeatCount="indefinite" />
        </rect>
        <rect x="13" y="64" width="34" height="14" rx="4" fill="#DC2626" opacity="0.18">
          <animate attributeName="opacity" values="0.18;0.06;0.18" dur="2.8s" repeatCount="indefinite" />
        </rect>
        {/* Línea vertical punteada */}
        <line x1="30" y1="0" x2="30" y2="300" stroke="#4ADE80" strokeWidth="1" strokeDasharray="4 10" opacity="0.12" />
        {/* Partícula verde */}
        <circle cx="30" cy="180" r="5" fill="#4ADE80" opacity="0.20">
          <animateTransform attributeName="transform" type="translate" values="0,0;0,-12;0,0" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.20;0.05;0.20" dur="2.2s" repeatCount="indefinite" />
        </circle>
        {/* Cruz pequeña inferior */}
        <rect x="25" y="220" width="10" height="28" rx="3" fill="#4ADE80" opacity="0.14">
          <animate attributeName="opacity" values="0.14;0.04;0.14" dur="3.2s" repeatCount="indefinite" begin="0.8s" />
        </rect>
        <rect x="17" y="230" width="26" height="10" rx="3" fill="#4ADE80" opacity="0.14">
          <animate attributeName="opacity" values="0.14;0.04;0.14" dur="3.2s" repeatCount="indefinite" begin="0.8s" />
        </rect>
      </svg>

    </div>
  );
}
