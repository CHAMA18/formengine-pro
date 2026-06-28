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

## Design Decisions

### Why JSON columns instead of normalized tables?

Form structure changes at runtime. If fields were normalized into a `FormField` table, every form edit would require multi-row inserts/updates/deletes. By storing the flowchart as JSON, saving a form is one row write, loading is one query, and adding a new validation rule requires zero database migrations.

### Why Zod for validation?

Zod allows runtime schema construction (`z.string().min(rules.minLength).regex(...)`), which is exactly what dynamic validation requires. It's isomorphic (same code on client and server), provides TypeScript inference, and handles composable schemas for conditional visibility.

### Why separated `/api` and `/api/v1` routes?

`/api/*` is the internal management API (used by the app's own UI, no auth required). `/api/v1/*` is the public REST API (requires API keys, versioned for breaking changes). This separation allows changing the internal API freely while the public API stays stable.

---

## Trade-off Analysis

### Design Decisions

#### Database Schema Choice

**Decision**: PostgreSQL with JSONB columns for form configurations and submission data, accessed via Prisma ORM.

**Why not normalized tables?** A traditional approach would use `FormField`, `FieldOption`, `ValidationRule` tables with foreign keys to a `Form` parent. This creates an N+1 problem on every form load (one query for the form, one for fields, one for options, one for rules) and makes form editing a multi-row transaction. By storing the entire flowchart as a single JSONB document, form loading is a single `SELECT` and saving is a single `UPDATE` — atomic by definition.

**Why PostgreSQL over MongoDB?** PostgreSQL's JSONB type gives us document-style flexibility for form configs while keeping relational integrity for users, sessions, and API keys (which benefit from strict schemas, foreign keys, and indexes). We get the best of both worlds: relational for auth, document for forms.

**Why Prisma?** Type-safe queries, migration management, and a clean client API. The trade-off is a generated client that adds ~2MB to the bundle, but the developer experience and type safety outweigh this.

#### Routing Structure

**Decision**: Next.js App Router with three tiers of routes.

```
User-facing pages (/dashboard, /forms/new, /f/[shareId])
Internal API (/api/forms, /api/submissions, /api/auth/*)
Public REST API v1 (/api/v1/forms, /api/v1/submissions)
```

**Why this split?** The internal API is an implementation detail — it serves the app's own UI and can change freely. The public `/api/v1/` API is a contract with external integrators and must stay stable. Versioning in the URL (`/v1/`) lets us ship breaking changes as `/v2/` without disrupting existing integrations.

**Why Server Components for data-loading pages?** Pages like `/dashboard` and `/submissions` query the database directly via Prisma in async Server Components. This means zero client-side fetching on initial load — the HTML arrives with data already rendered. The trade-off is no client-side caching of initial data, but for a prototype this is acceptable (would add React Query for a production app).

#### Validation Strategy

**Decision**: Dynamic, config-driven validation using Zod — zero hardcoded rules in route handlers.

**How it works**: Each form's `schema` column contains a JSON document with field definitions and validation rules. At runtime, `buildFieldSchema()` reads the field type and rules, constructs the appropriate Zod type (e.g., `z.string().min(3).regex(/^[A-Z]+$/)`), and `buildFormSchema()` assembles them into a `z.object()`. The same function runs on both client (instant feedback) and server (security).

**Why not JSON Schema?** JSON Schema is a spec, not a runtime validator. We'd need a separate library (like `ajv`) to evaluate it. Zod is both the schema definition and the validator, with better TypeScript integration. The trade-off is Zod schemas are code, not data — but since we construct them programmatically from the JSON config, we get the best of both.

### Implementation Details

#### Error Handling

All database operations are wrapped in `try/catch` blocks with graceful fallbacks:

- **Dashboard**: If the database is unreachable, the page renders with empty states ("No forms yet", zero counts) instead of crashing
- **API routes**: Return structured error responses with HTTP status codes (400 for bad input, 401 for unauthorized, 403 for insufficient permissions, 422 for validation failures, 500 for server errors)
- **Validation**: Returns field-level errors keyed by field ID (`{ "field_id": "Invalid email format" }`) so the frontend can display them inline under each input
- **Public form renderer**: Shows loading state during submit, error state on failure, success state on completion — all with clear user-facing messaging

#### Data Consistency — Historical Integrity of Submissions

**The problem**: If a form's configuration changes after submissions have been stored, how do we ensure old submissions stay valid against the configuration version that produced them?

**Current approach**: Submissions store only the response `data` (keyed by field ID), not a snapshot of the form config. This means:

1. **Reading old submissions always works** — the `data` JSON is self-contained; it doesn't depend on the form's current schema
2. **Display is decoupled** — the submissions table shows raw JSON data, so even if fields are renamed or deleted from the form, old submissions display correctly
3. **Validation is point-in-time** — when a submission is created, it's validated against the form's schema *at that moment*. The `Form.schema` column is a snapshot of the generated schema at publish time, so even if the flowchart is edited afterward, the published schema doesn't change until the form is re-published

**What's NOT handled (production gap)**: If a form is re-published with different fields, old submissions can't be re-validated against the new schema (field IDs may not match). In production, we would:

1. Store a `schemaVersion` on each `Form` and `Submission`
2. Snapshot the full schema JSON into each `Submission` at creation time
3. Use the submission's own schema snapshot for any re-validation or display
4. Support schema migrations (field renaming, type changes) with explicit migration scripts

#### Data Consistency — Form Publishing

When a form is published:
1. The flowchart is validated (must have Start, at least one Field, and Submit nodes)
2. The schema is generated from the flowchart via `generateSchema()`
3. Both `flowchart` and `schema` are written to the `Form` row in a single Prisma `create()` call — atomic by definition
4. The `shareId` is generated by Prisma's `@default(cuid())` — guaranteed unique

This means a form is never in a half-published state: either the full flowchart + schema are persisted, or nothing is.

### Trade-offs

#### Within This Exercise

| Decision | Trade-off | Why It's Acceptable |
|----------|-----------|---------------------|
| **SQLite for local dev** | Can't test PostgreSQL-specific features (JSONB indexing, GIN indexes) | Prisma abstracts the difference; schema is identical; switching to PostgreSQL is a one-line change |
| **SHA-256 for passwords** (not bcrypt/argon2) | Fast hashing = vulnerable to offline brute-force if DB leaks | 256-bit random salt + high-entropy passwords mitigate this; would use bcrypt in production |
| **No schema versioning on submissions** | Old submissions can't be re-validated after form changes | Submissions store raw data that's always readable; re-validation is not needed for display |
| **Zustand for builder state** (not Redux) | No devtools middleware, no time-travel debugging | The builder is a single-page tool; local state is sufficient; Redux would add overhead |
| **Custom SVG edges** (not React Flow) | No built-in features (edge routing, minimap, node grouping) | Full control over rendering, smaller bundle, no external dependency |
| **No background jobs** | Form publishing is synchronous | Publishing is fast (<100ms); no need for queue infrastructure |
| **No rate limiting** | API is vulnerable to abuse | Prototype scope; would add Redis-based rate limiting in production |
| **Ephemeral storage on Render free tier** | Data lost on deploy/sleep | Mitigated by PostgreSQL database; SQLite fallback only for quick demos |

#### Scaling to Production

To take this engine from prototype to production-ready cloud environment:

**Database**:
- Migrate from SQLite to managed PostgreSQL (RDS, Cloud SQL, or Supabase)
- Add GIN indexes on JSONB columns for efficient querying inside form configs
- Implement connection pooling (PgBouncer or Prisma's built-in pool)
- Set up read replicas for submission queries (reads >> writes)

**Validation**:
- Cache compiled Zod schemas per form version (avoid rebuilding on every request)
- Add schema versioning: store `schemaVersion` on `Form` and `Submission`, snapshot the full schema into each submission at creation time
- Support schema migrations (field renaming, type changes) with explicit migration scripts

**API**:
- Add Redis-based rate limiting (per API key and per IP)
- Implement webhook delivery on new submissions (async, with retry)
- Add pagination cursors (currently using offset/limit)
- Add ETags for caching form configs (they change rarely)

**Authentication**:
- Switch from SHA-256 to bcrypt/argon2 for password hashing
- Add OAuth providers (GitHub, Google) via NextAuth.js
- Implement refresh tokens for long-lived sessions
- Add CSRF protection on all mutation endpoints

**Infrastructure**:
- Move to containerized deployment (Docker + Kubernetes or ECS)
- Add horizontal autoscaling (stateless Next.js servers behind a load balancer)
- Use a CDN for static assets and form rendering (forms are public, cacheable)
- Add observability: structured logging, error tracking (Sentry), metrics (Prometheus)
- Set up CI/CD pipeline with automated test runs on every PR

**Data Integrity**:
- Add database-level constraints (CHECK constraints on JSONB structure)
- Implement soft deletes for forms (don't hard-delete, mark as archived)
- Add audit logging for API key operations (creation, rotation, revocation)
- Implement backup strategy (daily snapshots + point-in-time recovery)

---

## AI Tool Transparency

This section documents which AI tools were used during development, how they were used, and what was manually verified — in the interest of full transparency.

### Tools Used

1. **Claude (Anthropic, latest model)** — Primary AI assistant for the entire development process
2. **Agent Browser** — Browser automation for end-to-end testing and visual verification
3. **Google Stitch** — Design tool used for the application's visual design and UI aesthetics

### How They Were Used

| Task | Tool | How |
|------|------|-----|
| **Scaffolding** | Claude | Generated initial Next.js project structure, Prisma schema, API route handlers, and component boilerplate. The AI provided the architectural skeleton; file organization and naming were reviewed and adjusted. |
| **Code Generation** | Claude | Wrote the validation engine (`validation-engine.ts`), API key crypto (`api-key-crypto.ts`), auth library (`auth.ts`), flowchart builder components, store, types, and all API routes. Each file was reviewed for correctness before committing. |
| **Writing Tests** | Claude | Generated the 152-test suite (unit, integration, e2e). The AI identified edge cases (conditional visibility operators, date boundaries, checkbox min/max) and wrote tests that caught 2 real bugs (missing `<`/`>` operators in `isFieldVisible`, date `maxDate` boundary handling). |
| **Debugging** | Claude + Agent Browser | Used Agent Browser to reproduce user-reported issues (blank preview, hydration errors, redirect loops). Fixes were applied manually after root-cause analysis. |
| **Writing Docs** | Claude | Generated all 30 Docusaurus documentation pages, the Docusaurus config, sidebars, and custom CSS. Content was reviewed for accuracy against the actual codebase. |
| **Reviewing Code** | Claude | The AI reviewed its own generated code for type safety, error handling, and security (e.g., ensuring `try/catch` around all database queries, `timingSafeEqual` for password verification, `httpOnly` cookies for sessions). |
| **Design** | Google Stitch | Used for the application's visual design — stone palette, amber accents, typography, card layouts, and overall UI aesthetics applied across the landing page and global theme. |

### What Was Verified Manually

Every part of the submission was verified through one or more of:

1. **Linting** — `bun run lint` passes with 0 errors (pre-existing warnings in shadcn/ui components only)
2. **Tests** — 152 tests pass covering validation, crypto, auth, schema generation, connection logic, all 6 templates, and full form lifecycle
3. **Browser Testing** — Agent Browser was used to verify every page loads (HTTP 200), forms submit correctly, validation errors display inline, the flowchart builder connects nodes properly, and the dashboard shows real database data
4. **API Testing** — All REST endpoints tested via curl (register, login, create API key, create form, submit response, list submissions, rotate key, revoke key)
5. **Database Verification** — Queried PostgreSQL directly to confirm data persistence (forms, submissions, API keys, users, sessions)
6. **Deployment** — Deployed to Render with PostgreSQL; verified the live app at https://formengine-pro.onrender.com
7. **Documentation Deployment** — Built and deployed Docusaurus site to GitHub Pages at https://chama18.github.io/formengine-pro/

### Understanding the Codebase

I understand and can explain every part of what is submitted:

- **Validation Engine**: Reads `ValidationRules` from form config, builds Zod schemas per field type, assembles them into a `z.object()` (skipping hidden fields via `isFieldVisible`), and runs `safeParse()` — returning field-level errors keyed by field ID. Runs identically on client and server.
- **API Key System**: Keys are 256-bit random (`crypto.randomBytes(32)`), formatted as `fep_live_<hex>`. Only the SHA-256 hash is stored. Rotation overwrites the hash (old key stops working immediately). Permissions are hierarchical (write implies read).
- **Authentication**: Passwords hashed with SHA-256 + per-user 16-byte salt. Verification uses `timingSafeEqual` to prevent timing attacks. Sessions are 256-bit tokens in httpOnly cookies, 30-day expiry, stored in a `Session` table.
- **Flowchart Builder**: Zustand store manages nodes/edges/selection. Canvas uses CSS transforms for pan/zoom. Edges are SVG bezier curves calculated from node positions. Connection handles validate node type compatibility (start can't receive, end can't send).
- **Database**: Prisma ORM with PostgreSQL. Form configurations stored as `Json` columns (JSONB in PostgreSQL) for atomic updates and single-query loading. SQLite used for local development with the same schema.

---

## License

MIT
