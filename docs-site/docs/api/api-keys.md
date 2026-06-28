---
slug: /api/api-keys
title: API Key Management
sidebar_label: API Keys
description: CRUD + rotate API keys.
---
# API Key Management
- POST /api/api-keys — Create key (returns full key once)
- GET /api/api-keys — List keys (metadata only)
- PATCH /api/api-keys/{id} — Update name/permissions
- DELETE /api/api-keys/{id} — Revoke key
- POST /api/api-keys/{id}/rotate — Generate new key string
