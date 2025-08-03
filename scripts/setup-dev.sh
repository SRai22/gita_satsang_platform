#!/bin/bash

# Gita Satsang Platform Development Setup Script

echo "🕉️  Setting up Gita Satsang Platform for development..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file for backend if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📄 Creating backend environment file..."
    cp backend/.env.example backend/.env
    echo "✅ Backend .env file created. Please update with your actual values."
fi

# Create environment file for frontend if it doesn't exist
if [ ! -f frontend/.env ]; then
    echo "📄 Creating frontend environment file..."
    cat > frontend/.env << EOL
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Gita Satsang Platform
VITE_APP_ENV=development
EOL
    echo "✅ Frontend .env file created."
fi

# Create logs directory
mkdir -p backend/logs
mkdir -p backend/uploads

# Build and start services
echo "🚀 Starting development environment..."
docker-compose up -d mongodb redis

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
sleep 10

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Development environment setup complete!"
echo ""
echo "🌐 Services available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   MongoDB: mongodb://localhost:27017"
echo "   Redis: redis://localhost:6379"
echo ""
echo "🔧 Admin interfaces (with --profile dev):"
echo "   MongoDB Express: http://localhost:8081 (admin/admin123)"
echo "   Redis Commander: http://localhost:8082"
echo ""
echo "🚀 To start the application:"
echo "   Backend: cd backend && npm run dev"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "🐳 To start with Docker:"
echo "   docker-compose up"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose down"
