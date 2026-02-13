#!/bin/bash

# Define variables
DB_NAME="echoo"
DB_USER="bytedance" # Default macOS user for Homebrew Postgres

# Check if Docker is running
if docker info > /dev/null 2>&1; then
  echo "🐳 Docker is running. Starting PostgreSQL container..."
  docker-compose up -d postgres
  
  echo "Waiting for PostgreSQL container to be ready..."
  until docker exec echoo-postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo -n "."
    sleep 1
  done
  echo ""
  echo "✅ Docker PostgreSQL is ready!"
  exit 0
fi

echo "⚠️ Docker is not running."
echo "🔍 Checking for local PostgreSQL installation..."

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ Error: psql is not installed and Docker is not running."
    echo "Please install PostgreSQL or start Docker Desktop."
    exit 1
fi

# Check if Postgres is running locally
if ! psql -U "$DB_USER" -d postgres -c "SELECT 1" > /dev/null 2>&1; then
    echo "❌ Error: Local PostgreSQL is not running or user '$DB_USER' cannot connect."
    echo "Try starting it with: brew services start postgresql"
    exit 1
fi

echo "✅ Local PostgreSQL is running."

# Check if database exists
if psql -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "✅ Database '$DB_NAME' already exists."
else
    echo "Creating database '$DB_NAME'..."
    createdb -U "$DB_USER" "$DB_NAME"
    echo "✅ Database '$DB_NAME' created."
fi

echo "🎉 Database initialization complete!"
