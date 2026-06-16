import { useEffect, useState } from 'react';

/**
 * Theming centralizado de MediGuard.
 *
 * El tema vive en <html> de dos formas sincronizadas:
 *   - data-theme="light|dark"  → tokens de global.css / Home.css
 *   - clase .dark              → variante dark: de Tailwind y shadcn/ui
 *
 * Cualquier componente puede llamar useTheme(); todos quedan
 * sincronizados mediante el evento 'theme-change'.
 */

const THEME_KEY = 'theme';

export function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }));
}

/** Llamar una vez antes del primer render (main.jsx) para evitar flash. */
export function initTheme() {
  const theme = getInitialTheme();
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function useTheme() {
  const [theme, setTheme] = useState(() => getInitialTheme());

  useEffect(() => {
    const onChange = (e) => setTheme(e.detail);
    window.addEventListener('theme-change', onChange);
    return () => window.removeEventListener('theme-change', onChange);
  }, []);

  const toggleTheme = () => applyTheme(theme === 'light' ? 'dark' : 'light');

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
