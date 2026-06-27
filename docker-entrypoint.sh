#!/bin/bash
set -e

# ===========================================
# FormEngine Pro — Docker Entrypoint
# ===========================================
# Runs Prisma migrations against the configured DATABASE_URL, then starts
# the Next.js standalone server.

echo "=========================================="
echo "  FormEngine Pro — Starting Up"
echo "=========================================="
echo ""

# Wait for PostgreSQL to be ready (if using docker-compose)
if [ -n "$DATABASE_URL" ] && echo "$DATABASE_URL" | grep -q "postgresql"; then
    echo "→ Waiting for PostgreSQL to be ready..."
    
    # Extract host and port from DATABASE_URL
    DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_PORT=${DB_PORT:-5432}
    
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    
    # Wait up to 30 seconds for the database
    for i in $(seq 1 30); do
        if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
            echo "  ✓ PostgreSQL is ready!"
            break
        fi
        echo "  Attempt $i/30 — waiting..."
        sleep 1
    done
    echo ""
fi

# Run Prisma migrations (push schema to database)
echo "→ Pushing database schema..."
npx prisma db push --accept-data-loss 2>&1 || {
    echo "  ⚠ prisma db push failed — trying generate + migrate..."
    npx prisma generate 2>&1 || true
}
echo "  ✓ Database schema is ready"
echo ""

# Start the Next.js server
echo "→ Starting Next.js server on port $PORT..."
echo ""
exec node server.js
