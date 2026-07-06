# Imagen de desarrollo local para frontend_react (React + Vite).
# Ejecuta el mismo `npm run dev` de siempre; solo se añade --host para que
# el servidor sea alcanzable desde fuera del contenedor. No se toca ningún
# archivo fuente ni vite.config.js.
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
