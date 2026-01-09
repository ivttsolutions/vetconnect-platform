# VetConnect Platform

🐾 Professional social network exclusively for the veterinary sector

## 📋 Project Overview

VetConnect is a comprehensive social networking platform for the veterinary industry, featuring:

- 👥 **Professional Networking** - Connect with veterinary professionals worldwide
- 💼 **Job Board** - Post and find veterinary positions
- 💬 **Real-time Messaging** - Chat with colleagues and companies
- 📱 **News Feed** - Share clinical cases, articles, and professional updates
- 🏢 **Company Profiles** - Product catalogs, events, and marketing tools
- 🐕 **Animal Shelters Program** - Free platform access for animal protection organizations
- 📅 **Events Management** - Create and manage professional events
- 🛍️ **Product Catalog** - Showcase veterinary products and services

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (React 18) with App Router
- TypeScript
- TailwindCSS + shadcn/ui
- Socket.io Client
- i18next (8 languages support)

**Backend:**
- Node.js + Express + TypeScript
- Prisma ORM
- Socket.io (WebSockets)
- Bull (Job Queues)
- Jest (Testing)

**Databases:**
- PostgreSQL (Main database)
- Redis (Cache, sessions, queues, pub/sub)

**Infrastructure:**
- Docker Compose
- Nginx (Reverse Proxy)
- MinIO (S3-compatible storage)

**Third-party Services:**
- SendGrid (Email)
- Stripe (Payments)
- Bunny CDN (Content Delivery)

## 📁 Project Structure

```
vetconnect-platform/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js 14 App Router
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and helpers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   └── i18n/            # Internationalization
│   ├── public/              # Static assets
│   └── tests/               # Frontend tests
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models (Prisma)
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities
│   │   ├── config/          # Configuration
│   │   ├── jobs/            # Background jobs (Bull)
│   │   └── socket/          # Socket.io handlers
│   ├── prisma/              # Prisma schema and migrations
│   └── tests/               # Backend tests
├── docker/                   # Docker configuration
│   ├── nginx/               # Nginx configs
│   ├── postgres/            # PostgreSQL init scripts
│   └── minio/               # MinIO configs
├── docs/                     # Documentation
│   ├── api/                 # API documentation (Swagger)
│   ├── database/            # Database schema docs
│   └── deployment/          # Deployment guides
└── docker-compose.yml        # Docker Compose orchestration
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose (v2.0+)
- Node.js 20+ (for local development)
- Git

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/vetconnect-platform.git
cd vetconnect-platform
```

2. **Configure environment variables:**
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the .env files with your credentials
```

3. **Start the platform with Docker:**
```bash
docker-compose up -d
```

4. **Run database migrations:**
```bash
docker-compose exec backend npm run prisma:migrate
```

5. **Seed initial data (optional):**
```bash
docker-compose exec backend npm run seed
```

### Access the Platform

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **API Documentation:** http://localhost:4000/api-docs
- **MinIO Console:** http://localhost:9001
- **Adminer (DB):** http://localhost:8080

### Default Credentials (Development Only)

**Admin User:**
- Email: admin@vetconnect.com
- Password: Admin123!

**MinIO:**
- Access Key: minioadmin
- Secret Key: minioadmin

## 🛠️ Development

### Local Development (without Docker)

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Running Tests

**All tests:**
```bash
docker-compose exec backend npm run test
docker-compose exec frontend npm run test
```

**With coverage:**
```bash
docker-compose exec backend npm run test:coverage
```

### Database Operations

**Create migration:**
```bash
docker-compose exec backend npm run prisma:migrate:dev
```

**Reset database:**
```bash
docker-compose exec backend npm run prisma:reset
```

**Prisma Studio (Database GUI):**
```bash
docker-compose exec backend npm run prisma:studio
```

## 🌍 Internationalization

Supported languages:
- 🇬🇧 English (default)
- 🇪🇸 Spanish
- 🇩🇪 German
- 🇫🇷 French
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇳🇱 Dutch
- 🇧🇪 Catalan

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [Database Schema](./docs/database/schema.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)

## 🔐 Security Features

- ✅ JWT Authentication
- ✅ 2FA (TOTP - Google/Microsoft Authenticator)
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Helmet.js security headers
- ✅ Input validation (Zod)

## 🚀 Deployment

### Production Deployment

See [Deployment Guide](./docs/deployment/README.md) for detailed instructions.

**Quick deploy to production:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

Key environment variables to configure:

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens
- `SENDGRID_API_KEY` - SendGrid API key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `MINIO_ENDPOINT` - MinIO endpoint
- `BUNNY_CDN_API_KEY` - Bunny CDN API key

**Frontend:**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL

## 📊 Monitoring & Logging

- Application logs: `docker-compose logs -f [service]`
- Database logs: `docker-compose logs -f postgres`
- Redis logs: `docker-compose logs -f redis`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file.

## 👥 Team

- Project Lead: [Your Name]
- Backend Lead: [Name]
- Frontend Lead: [Name]
- DevOps: [Name]

## 🆘 Support

- Email: support@vetconnect.com
- Documentation: https://docs.vetconnect.com
- Issues: https://github.com/your-org/vetconnect-platform/issues

## 🗺️ Roadmap

### Phase 1 - MVP ✅
- [x] User authentication & profiles
- [x] News feed
- [x] Networking features
- [x] Messaging system
- [x] Basic search

### Phase 2 - Jobs 🚧
- [ ] Job posting
- [ ] Job applications
- [ ] Candidate management
- [ ] Job alerts

### Phase 3 - Business Features 📋
- [ ] Product catalog
- [ ] Event management
- [ ] Marketing tools
- [ ] Analytics dashboard

### Phase 4 - Shelters Program 🐾
- [ ] Animal adoption system
- [ ] Volunteer management
- [ ] Donation system
- [ ] Solidarity portal

### Phase 5 - Premium & Monetization 💰
- [ ] Subscription plans
- [ ] Sponsored posts
- [ ] Premium features
- [ ] Payment processing

### Phase 6 - Mobile & Expansion 📱
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics
- [ ] API for third-party
- [ ] Marketplace

## 📈 Statistics

- **Total Users:** TBD
- **Active Companies:** TBD
- **Animal Shelters Helped:** TBD
- **Jobs Posted:** TBD
- **Successful Connections:** TBD

---

**Built with ❤️ for the veterinary community**
