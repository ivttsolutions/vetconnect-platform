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
