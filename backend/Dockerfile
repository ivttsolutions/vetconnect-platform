FROM node:20-alpine

RUN apk add --no-cache openssl openssl-dev

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate || echo "Prisma skipped"
EXPOSE 4000
CMD ["node", "--loader", "ts-node/esm", "src/server.ts"]
