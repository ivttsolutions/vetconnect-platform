FROM node:20-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    openssl \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production=false

# Copiar código
COPY . .

# Generar Prisma y compilar
RUN npx prisma generate && \
    npm run build

EXPOSE 4000

# Iniciar aplicación
CMD ["node", "dist/server.js"]
