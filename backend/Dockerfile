FROM node:20

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g prisma
RUN prisma generate
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/server.js"]
