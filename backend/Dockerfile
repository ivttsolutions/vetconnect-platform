FROM node:20

RUN apt-get update && apt-get install -y openssl

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || npx tsc
EXPOSE 4000
CMD ["sh", "-c", "npx prisma generate && node dist/server.js"]
