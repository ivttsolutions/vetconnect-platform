FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

EXPOSE 4000

CMD ["npm", "run", "dev"]
