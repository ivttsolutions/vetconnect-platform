FROM node:20-alpine
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código
COPY . .

# Generar Prisma Client (si falla, continuar)
RUN npm run prisma:generate || true

# Exponer puerto
EXPOSE 4000

# Comando de inicio
CMD ["npm", "run", "dev"]
