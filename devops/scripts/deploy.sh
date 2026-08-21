#!/bin/bash
set -e

echo "======================================"
echo "🚢 Deploying SkillForge via Docker Compose"
echo "======================================"

# Find docker-compose file
COMPOSE_FILE="docker-compose.yml"
if [ ! -f "$COMPOSE_FILE" ]; then
  if [ -f "skillforge/docker-compose.yml" ]; then
    COMPOSE_FILE="skillforge/docker-compose.yml"
  else
    echo "❌ Cannot find docker-compose.yml!"
    exit 1
  fi
fi

echo "Building and starting containers in detached mode..."
if ! docker-compose -f "$COMPOSE_FILE" up --build -d; then
  echo "❌ Deployment failed! Attempting rollback (stopping containers)..."
  docker-compose -f "$COMPOSE_FILE" down
  exit 1
fi

echo "======================================"
echo "✅ Deployment Successful!"
echo "📡 Client: http://localhost:3000 (or 5173)"
echo "🔌 API Gateway: http://localhost:5000"
echo "🧠 AI Service: http://localhost:8000"
echo "======================================"
