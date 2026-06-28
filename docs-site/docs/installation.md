---
slug: /installation
title: Installation
sidebar_label: Installation
description: Install FormEngine Pro locally with Docker Compose or from source.
---

# Installation

FormEngine Pro can be installed and run locally in two ways: **Docker Compose** (recommended) or **from source**.

## Prerequisites

- [Node.js 20+](https://nodejs.org/) or [Bun](https://bun.sh/)
- [Docker](https://docs.docker.com/get-docker/) (for Docker setup)
- [PostgreSQL 14+](https://www.postgresql.org/) (for non-Docker setup)

## Option 1: Docker Compose (Recommended)

The easiest way to run FormEngine Pro. Spins up PostgreSQL + the app with one command.

```bash
# Clone the repository
git clone https://github.com/CHAMA18/formengine-pro.git
cd formengine-pro

# (Optional) Configure environment
cp .env.example .env

# Start the stack
docker-compose up
```

The app will be available at **http://localhost:3000**

- PostgreSQL runs on `localhost:5432` (user: `fep`, password: `fep_password`, db: `formengine`)
- The app automatically runs database migrations on startup

### Stopping

```bash
# Stop containers (data preserved)
docker-compose down

# Stop and delete all data
docker-compose down -v
```

## Option 2: From Source

### Step 1: Clone

```bash
git clone https://github.com/CHAMA18/formengine-pro.git
cd formengine-pro
```

### Step 2: Install Dependencies

```bash
bun install
# or: npm install
```

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your PostgreSQL connection string:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/formengine?schema=public
```

### Step 4: Create Database Schema

```bash
bun run db:push
# or: npx prisma db push
```

### Step 5: Start the Dev Server

```bash
bun run dev
# or: npm run dev
```

The app will be available at **http://localhost:3000**

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `NEXT_PUBLIC_SUPABASE_URL` | No | placeholder | Supabase project URL (for OAuth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | placeholder | Supabase anon key (for OAuth) |

## Verification

After installation, verify everything works:

1. Visit `http://localhost:3000` — the landing page should load
2. Go to `/signup` — register a new account
3. Go to `/forms/new` — the flowchart builder should load
4. Go to `/dashboard` — you should see real data

## Troubleshooting

### Port already in use

```bash
# Change the port in package.json
"dev": "next dev -p 3001"
```

### Database connection failed

Ensure PostgreSQL is running and `DATABASE_URL` is correct:

```bash
# Test connection
psql $DATABASE_URL
```

### Prisma client not generated

```bash
npx prisma generate
npx prisma db push
```
