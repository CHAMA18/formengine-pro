# FormEngine Pro — Dynamic Form Builder Engine

A world-class form builder platform with a visual flowchart editor, dynamic validation engine, REST API, and guided walkthrough.

## Demo Video

[![FormEngine Pro Demo](https://cdn.loom.com/sessions/thumbnails/05d568bf4e314ae79a8eb902ecd5aa61-with-play.svg)](https://www.loom.com/share/05d568bf4e314ae79a8eb902ecd5aa61)

**[Watch the walkthrough on Loom](https://www.loom.com/share/05d568bf4e314ae79a8eb902ecd5aa61)** — See the flowchart builder, validation engine, API, and deployment in action.

## Features

- **Visual Flowchart Builder** — Drag-and-drop node editor for designing forms
- **Dynamic Validation** — Validation rules stored in form config, evaluated at runtime via Zod (no hardcoded rules)
- **13 Field Types** — text, email, password, number, tel, url, textarea, dropdown, radio, checkbox, date, rating, file
- **Conditional Logic** — Branch form flow based on field values (true/false paths)
- **6 Starter Templates** — KYC, Feedback, Event Registration, Support Ticket, Job Application, Contact Form
- **Public Form Rendering** — Shareable links at `/f/{shareId}`
- **REST API v1** — Full programmatic access with API key authentication
- **API Key Management** — Create, rotate, and revoke keys with scoped permissions
- **Real-time Dashboard** — Live form counts, submission stats, and form library
- **Guided Walkthrough** — 22-step interactive tour across all sections
- **Submission Tracking** — Searchable, expandable submission table with JSON payload viewer

---

## Quick Start (Docker Compose) — Recommended

The easiest way to run FormEngine Pro locally. Spins up PostgreSQL + the app with one command.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/CHAMA18/formengine-pro.git
cd formengine-pro

# 2. (Optional) Configure environment variables
cp .env.example .env
# Edit .env if you want to change database credentials or add Supabase

# 3. Start the stack
docker-compose up

# The first build takes ~3-5 minutes. Subsequent starts are instant.
```

The app will be available at **http://localhost:3000**

- PostgreSQL runs on `localhost:5432` (user: `fep`, password: `fep_password`, db: `formengine`)
- The app automatically runs database migrations on startup

### Stopping

```bash
# Stop containers (data is preserved in a Docker volume)
docker-compose down

# Stop and delete all database data
docker-compose down -v
```

---

## Local Development (without Docker)

If you prefer running the app directly with `bun` or `npm`:

### Prerequisites

- [Node.js 20+](https://nodejs.org/) or [Bun](https://bun.sh/)
- [PostgreSQL 14+](https://www.postgresql.org/download/) (or use Docker just for the DB: `docker run -d -p 5432:5432 -e POSTGRES_USER=fep -e POSTGRES_PASSWORD=fep_password -e POSTGRES_DB=formengine postgres:16-alpine`)

### Steps

```bash
# 1. Clone
git clone https://github.com/CHAMA18/formengine-pro.git
cd formengine-pro

# 2. Install dependencies
bun install
# or: npm install

# 3. Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL to your PostgreSQL connection string

# 4. Create the database schema
bun run db:push
# or: npx prisma db push

# 5. Start the dev server
bun run dev
# or: npm run dev
```

The app will be available at **http://localhost:3000**

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/db?schema=public`) |
| `NEXT_PUBLIC_SUPABASE_URL` | No | placeholder | Supabase project URL (only needed for OAuth/email auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | placeholder | Supabase anon key (only needed for OAuth/email auth) |

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

---

## Database Schema

The app uses Prisma ORM with PostgreSQL. Three main models:

### Form
Stores the form configuration as JSONB:
- `flowchart` — the visual node/edge graph (source of truth)
- `schema` — the generated field definitions + validation rules
- `shareId` — public URL slug for `/f/{shareId}`
- `status` — "draft" or "published"

### Submission
Stores form responses as JSONB:
- `data` — `{ field_id: value, ... }`
- `source` — submitter IP
- `formId` — links to the Form

### ApiKey
Stores API key metadata (never the full key):
- `keyHash` — SHA-256 hash of the full key
- `keyPrefix` — first 12 chars for UI display
- `permissions` — JSON array of scopes
- `status` — "active" or "revoked"

To modify the schema, edit `prisma/schema.prisma` then run:

```bash
bun run db:push
# or: npx prisma db push
```

---

## REST API

All API routes require an API key via `Authorization: Bearer <key>` or `x-api-key: <key>` header.

Create an API key at **http://localhost:3000/api-keys**

### Endpoints

| Method | Endpoint | Scope | Description |
|--------|----------|-------|-------------|
| GET | `/api/v1/forms` | `forms:read` | List published forms |
| POST | `/api/v1/forms` | `forms:write` | Create a form from flowchart |
| GET | `/api/v1/forms/{shareId}` | `forms:read` | Get form schema |
| GET | `/api/v1/forms/{shareId}/submissions` | `submissions:read` | List submissions |
| POST | `/api/v1/forms/{shareId}/submissions` | `submissions:write` | Submit a response |
| GET | `/api/v1/submissions` | `submissions:read` | List all submissions |

### Example

```bash
# List forms
curl http://localhost:3000/api/v1/forms \
  -H "Authorization: Bearer fep_live_your_key_here"

# Submit a form response
curl -X POST http://localhost:3000/api/v1/forms/{shareId}/submissions \
  -H "Authorization: Bearer fep_live_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"data": {"field_id": "value"}}'
```

Full interactive documentation at **http://localhost:3000/docs/api**

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Database**: PostgreSQL 16 + Prisma 6 ORM
- **Validation**: Zod (dynamic, config-driven)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State**: Zustand (flowchart builder, walkthrough)
- **Visual Editor**: Custom canvas with SVG edges, drag-and-drop nodes
- **Containerization**: Docker + Docker Compose

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── api/v1/                 # Public REST API (API key auth)
│   ├── api/                    # Internal management API
│   ├── dashboard/              # Real-time dashboard
│   ├── forms/new/              # Flowchart builder
│   ├── templates/              # Starter + published templates
│   ├── submissions/            # Submission tracking
│   ├── api-keys/               # API key management
│   ├── settings/               # Settings + walkthrough
│   ├── docs/api/               # Interactive API docs
│   ├── f/[shareId]/            # Public form rendering
│   └── ...
├── components/
│   ├── flowchart/              # Builder components
│   ├── ui/                     # shadcn/ui primitives
│   └── ...
└── lib/
    ├── flowchart/              # Types, schema generator, validation engine
    ├── api-key-crypto.ts       # Key generation, hashing
    ├── api-auth.ts             # API key authentication middleware
    ├── walkthrough.ts          # 22-step guided tour
    └── db.ts                   # Prisma client
prisma/
└── schema.prisma               # Database models
```

---

## License

MIT
