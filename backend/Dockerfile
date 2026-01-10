FROM node:20-alpine

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl openssl-dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate || echo "Prisma skipped"
EXPOSE 4000
CMD ["npx", "ts-node", "src/server.ts"]
