FROM node:20-alpine

WORKDIR /app

# Copiar package.json primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar TODO el código del frontend
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando
CMD ["npm", "run", "dev"]
