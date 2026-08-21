#!/bin/bash
set -e

echo "======================================"
echo "🚀 SkillForge Local Environment Setup"
echo "======================================"

echo "Checking dependencies..."
if ! command -v docker &> /dev/null; then echo "❌ Docker not found!"; exit 1; fi
if ! command -v node &> /dev/null; then echo "❌ Node.js not found!"; exit 1; fi
if ! command -v python3 &> /dev/null; then echo "❌ Python3 not found!"; exit 1; fi
echo "✅ All dependencies installed."

echo "Setting up AI Service (Python)..."
cd skillforge/ai-service
if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate || source .venv/Scripts/activate
pip install -r requirements.txt
if [ ! -f ".env" ]; then
  cp .env.example .env 2>/dev/null || touch .env
  echo "✅ Created ai-service/.env"
fi
cd ../..

echo "Setting up API Gateway (Node.js)..."
cd skillforge/api-gateway
npm install
if [ ! -f ".env" ]; then
  cp .env.example .env 2>/dev/null || touch .env
  echo "✅ Created api-gateway/.env"
fi
cd ../..

echo "Setting up Frontend Client (React/Vite)..."
cd skillforge/client
npm install
if [ ! -f ".env" ]; then
  cp .env.example .env 2>/dev/null || touch .env
  echo "✅ Created client/.env"
fi
cd ../..

echo "======================================"
echo "🎉 Setup Complete! Run './devops/scripts/deploy.sh' to launch."
echo "======================================"
