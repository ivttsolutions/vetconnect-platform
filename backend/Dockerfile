FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production

COPY dist ./dist

RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/server.js"]
