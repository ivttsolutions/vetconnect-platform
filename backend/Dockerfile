FROM node:20-alpine

WORKDIR /app

# Copiar package.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar TODO el código del backend
COPY . .

# Generar Prisma Client (ignorar error)
RUN npm run prisma:generate || echo "Prisma generate skipped"

# Exponer puerto
EXPOSE 4000

# Comando
CMD ["npx", "ts-node", "src/server.ts"]
