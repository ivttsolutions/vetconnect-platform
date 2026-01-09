#!/bin/bash

# VetConnect Platform - Complete Project Generator
# This script generates the entire codebase structure

set -e

echo "🚀 VetConnect Platform Generator"
echo "================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR=$(pwd)

echo -e "${GREEN}📁 Creating directory structure...${NC}"

# Backend directories
mkdir -p backend/src/{controllers,services,middleware,routes,utils,config,jobs,socket,types,validators}
mkdir -p backend/tests/{unit,integration,e2e}
mkdir -p backend/uploads backend/logs

# Frontend directories  
mkdir -p frontend/src/app/\(auth\)/{login,register,verify-email,forgot-password,setup-2fa}
mkdir -p frontend/src/app/\(dashboard\)/{feed,network,jobs,messages,events,products,solidarity,groups}
mkdir -p frontend/src/app/profile frontend/src/app/company frontend/src/app/shelter
mkdir -p frontend/src/app/settings frontend/src/app/admin
mkdir -p frontend/src/components/{layout,feed,profile,jobs,messages,events,products,shelters,common,ui}
mkdir -p frontend/src/{lib,hooks,context,types}
mkdir -p frontend/src/i18n/locales/{en,es,de,fr,it,pt,nl,ca}
mkdir -p frontend/public/{images,icons,fonts}

# Docker directories
mkdir -p docker/{nginx,postgres,minio}

# Docs directories
mkdir -p docs/{api,database,deployment,development,user-guides}

# Scripts directory
mkdir -p scripts

echo -e "${GREEN}✅ Directory structure created${NC}"
echo ""

# ============================================
# BACKEND FILES GENERATION
# ============================================

echo -e "${GREEN}📝 Generating backend configuration files...${NC}"

# backend/Dockerfile
cat > backend/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

EXPOSE 4000

CMD ["npm", "run", "dev"]
EOF

# backend/Dockerfile.prod
cat > backend/Dockerfile.prod << 'EOF'
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 4000

CMD ["npm", "start"]
EOF

# backend/.gitignore
cat > backend/.gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Uploads
uploads/*
!uploads/.gitkeep

# Prisma
prisma/migrations/
node_modules/.prisma/
EOF

# backend/.eslintrc.js
cat > backend/.eslintrc.js << 'EOF'
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
EOF

# backend/.prettierrc
cat > backend/.prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
EOF

# backend/jest.config.js
cat > backend/jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
EOF

# backend/nodemon.json
cat > backend/nodemon.json << 'EOF'
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts", "src/**/*.test.ts"],
  "exec": "ts-node -r tsconfig-paths/register src/server.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
EOF

echo -e "${GREEN}✅ Backend configuration files created${NC}"
echo ""

# ============================================
# FRONTEND FILES GENERATION
# ============================================

echo -e "${GREEN}📝 Generating frontend configuration files...${NC}"

# frontend/package.json
cat > frontend/package.json << 'EOF'
{
  "name": "vetconnect-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "axios": "^1.6.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "i18next": "^23.7.11",
    "lucide-react": "^0.303.0",
    "next-themes": "^0.2.1",
    "react-hook-form": "^7.49.2",
    "react-i18next": "^14.0.0",
    "socket.io-client": "^4.6.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
EOF

# frontend/tsconfig.json
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# frontend/next.config.js
cat > frontend/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'vetconnect.b-cdn.net'],
  },
  i18n: {
    locales: ['en', 'es', 'de', 'fr', 'it', 'pt', 'nl', 'ca'],
    defaultLocale: 'en',
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL,
  },
}

module.exports = nextConfig
EOF

# frontend/tailwind.config.ts
cat > frontend/tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
EOF

# frontend/.env.local.example
cat > frontend/.env.local.example << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_MINIO_URL=http://localhost:9000
NEXT_PUBLIC_APP_NAME=VetConnect
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,es,de,fr,it,pt,nl,ca
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
EOF

# frontend/Dockerfile
cat > frontend/Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
EOF

# frontend/Dockerfile.prod
cat > frontend/Dockerfile.prod << 'EOF'
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

EXPOSE 3000

CMD ["npm", "start"]
EOF

# frontend/.gitignore
cat > frontend/.gitignore << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF

echo -e "${GREEN}✅ Frontend configuration files created${NC}"
echo ""

# ============================================
# DOCKER & NGINX CONFIGURATION
# ============================================

echo -e "${GREEN}📝 Generating Docker and Nginx configuration...${NC}"

# docker/nginx/nginx.conf
cat > docker/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    include /etc/nginx/conf.d/*.conf;
}
EOF

# docker/nginx/default.conf
cat > docker/nginx/default.conf << 'EOF'
upstream frontend {
    server frontend:3000;
}

upstream backend {
    server backend:4000;
}

server {
    listen 80;
    server_name localhost;

    client_max_body_size 20M;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# docker/postgres/init.sql
cat > docker/postgres/init.sql << 'EOF'
-- VetConnect Database Initialization

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Full-text search configuration for multiple languages
CREATE TEXT SEARCH CONFIGURATION public.spanish (COPY = pg_catalog.spanish);
CREATE TEXT SEARCH CONFIGURATION public.english (COPY = pg_catalog.english);
CREATE TEXT SEARCH CONFIGURATION public.german (COPY = pg_catalog.german);
CREATE TEXT SEARCH CONFIGURATION public.french (COPY = pg_catalog.french);

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vetconnect TO vetconnect;
EOF

echo -e "${GREEN}✅ Docker and Nginx configuration created${NC}"
echo ""

# ============================================
# DOCUMENTATION
# ============================================

echo -e "${GREEN}📝 Creating documentation files...${NC}"

# docs/api/README.md
cat > docs/api/README.md << 'EOF'
# VetConnect API Documentation

## Base URL
```
http://localhost:4000/api/v1
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/verify-email` - Verify email
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/setup-2fa` - Setup 2FA
- `POST /auth/verify-2fa` - Verify 2FA code

### Users
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user
- `DELETE /users/me` - Delete current user
- `GET /users/:id` - Get user by ID
- `GET /users/search` - Search users

### Profiles
- `GET /profiles/:userId` - Get user profile
- `PUT /profiles/:userId` - Update profile
- `POST /profiles/experience` - Add experience
- `PUT /profiles/experience/:id` - Update experience
- `DELETE /profiles/experience/:id` - Delete experience

[... Full API documentation in Swagger format ...]
EOF

echo -e "${GREEN}✅ Documentation created${NC}"
echo ""

# ============================================
# GITIGNORE ROOT
# ============================================

cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*

# Dependencies
node_modules/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/
.next/
out/

# Database
*.db
*.sqlite
EOF

# ============================================
# SCRIPTS
# ============================================

echo -e "${GREEN}📝 Creating utility scripts...${NC}"

# scripts/setup.sh
cat > scripts/setup.sh << 'SETUPEOF'
#!/bin/bash
echo "🚀 Setting up VetConnect Platform..."

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

echo "✅ Environment files created"
echo "⚠️  Please edit backend/.env and frontend/.env.local with your configuration"
echo ""
echo "To start the platform:"
echo "  docker-compose up -d"
echo ""
echo "Then run migrations:"
echo "  docker-compose exec backend npm run prisma:migrate"
SETUPEOF

chmod +x scripts/setup.sh

echo ""
echo -e "${GREEN}✅ Project generation complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Run: ./scripts/setup.sh"
echo "  2. Edit backend/.env and frontend/.env.local"
echo "  3. Run: docker-compose up -d"
echo "  4. Run: docker-compose exec backend npm run prisma:migrate"
echo "  5. Access: http://localhost:3000"
echo ""
echo -e "${YELLOW}⚠️  Note: You still need to implement the application logic in controllers, services, and React components${NC}"
echo ""
