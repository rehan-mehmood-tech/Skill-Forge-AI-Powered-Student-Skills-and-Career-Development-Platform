#!/bin/bash
# Zero-DB Free Tier Keep-Alive Configuration
# This script is intended to be run by a cron job every 10 minutes.
# It pings ONLY the static /health endpoints of the API Gateway and AI Microservice.
# This prevents Render spin-down without querying PostgreSQL or Redis (saving DB quotas).

API_GATEWAY_URL=${API_GATEWAY_URL:-"https://your-api-gateway-url.onrender.com"}
AI_SERVICE_URL=${AI_SERVICE_URL:-"https://your-ai-service-url.onrender.com"}

echo "Pinging API Gateway Health..."
curl -s "${API_GATEWAY_URL}/health" > /dev/null

echo "Pinging AI Service Health..."
curl -s "${AI_SERVICE_URL}/health" > /dev/null

echo "Ping complete."
