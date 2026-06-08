// Tailwind v4 no requiere este archivo — la configuración vive en index.css con @theme.
// El escaneo de archivos es automático via @tailwindcss/vite.
// Este archivo se mantiene solo para compatibilidad con herramientas que lo busquen.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
};
