---
slug: /features/authentication
title: Authentication
sidebar_label: Authentication
description: Database-backed auth with sessions.
---
# Authentication
Real database-backed auth: SHA-256 + salt password hashing, 256-bit session tokens, httpOnly cookies (30-day expiry). Endpoints: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me.
