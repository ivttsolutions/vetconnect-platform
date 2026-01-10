FROM node:20-bullseye

RUN apt-get update && \
    apt-get install -y openssl procps && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "npx prisma generate && npx tsc && node dist/server.js"]
