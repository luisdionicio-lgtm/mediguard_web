import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import App from './App.jsx';
import { initTheme } from './hooks/useTheme.js';
import './index.css';
import './styles/global.css';

initTheme();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Siempre se envuelve en GoogleOAuthProvider, aunque no haya client ID
// configurado: useGoogleLogin/useGoogleOAuth exigen el contexto del
// provider para existir (si no, tiran "must be used within
// GoogleOAuthProvider" y rompen toda la pantalla). Con clientId vacío el
// provider igual monta sin error; los botones de Google quedan
// deshabilitados vía GOOGLE_ENABLED en Login.jsx/Register.jsx.
const root = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')).render(root);
