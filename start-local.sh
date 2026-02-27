#!/usr/bin/env bash
set -e

# Quick helper to start the project locally with docker-compose.
# Usage: ./start-local.sh

if [ ! -f .env ]; then
  echo ".env not found. Copy .env.example to .env and set DB_PASSWORD before running."
  echo "cp .env.example .env"
  exit 1
fi

echo "Starting AntiBudget via docker compose..."
docker compose up -d --build

echo "Services started. Frontend: http://localhost:3000, Backend: http://localhost:18081"
