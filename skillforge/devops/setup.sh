#!/usr/bin/env bash
set -euo pipefail

echo "==> SkillForge Deployment Setup"
command -v docker >/dev/null || { echo "Docker required"; exit 1; }
command -v kubectl >/dev/null || echo "kubectl not found — skipping K8s steps"

echo "==> Loading environment"
[ -f .env ] || cp .env.example .env

echo "==> Building images"
docker compose build

echo "==> Running DB migrations against Supabase"
npx supabase db push --project-ref "$SUPABASE_PROJECT_REF"

echo "==> Seeding knowledge base + role requirements"
python3 ai-service/scripts/seed_kb.py

echo "==> Starting stack"
docker compose up -d

echo "==> Health check"
sleep 5
curl -fsS http://localhost:4000/health && echo "Gateway OK"
curl -fsS http://localhost:8000/health && echo "AI Service OK"

echo "==> Deployment complete. Client: http://localhost:3000"
