FROM node:20-slim

RUN apt-get update && apt-get install -y openssl procps && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npx tsc

EXPOSE 4000

CMD ["node", "dist/server.js"]
