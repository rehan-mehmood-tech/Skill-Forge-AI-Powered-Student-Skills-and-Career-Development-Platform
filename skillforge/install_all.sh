#!/bin/bash
echo "=============================================="
echo "Installing Skill-Forge Dependencies"
echo "=============================================="

echo ""
echo "[1/3] Installing Python Backend (ai-service)..."
cd ai-service || exit
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo ""
echo "[2/3] Installing Node API Gateway (api-gateway)..."
cd api-gateway || exit
npm install
cd ..

echo ""
echo "[3/3] Installing Frontend Client (client)..."
cd client || exit
npm install
cd ..

echo ""
echo "=============================================="
echo "Setup Complete! All dependencies are installed."
echo "=============================================="
