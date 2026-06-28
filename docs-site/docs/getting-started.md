---
slug: /getting-started
title: Getting Started
sidebar_label: Overview
description: Learn what FormEngine Pro is and how it solves dynamic form building.
---

# Getting Started

Welcome to **FormEngine Pro** — the world's most advanced dynamic form builder engine. This documentation will guide you through every feature, from building your first form to deploying to production.

## What is FormEngine Pro?

FormEngine Pro is a full-stack application that lets you:

- **Design forms visually** using a drag-and-drop flowchart builder with 5 node types and 13 field types
- **Validate dynamically** — validation rules are stored in form configuration (JSON), not hardcoded in application code
- **Store submissions safely** linked to the form that produced them
- **Integrate via REST API** with scoped, rotatable API keys
- **Deploy anywhere** with Docker Compose or Render

## Why FormEngine Pro?

In many enterprise applications, user-facing forms change frequently due to shifting business requirements, regulatory updates, or localisation needs. Hardcoding forms into static database tables leads to high development overhead, constant redeployments, and complex data migration paths.

FormEngine Pro solves this by treating form fields as **dynamic configurations** — stored as JSON, validated at runtime, and rendered from config. No code changes needed to add a field, change a validation rule, or add a conditional branch.

## Key Features

| Feature | Description |
|---------|-------------|
| Visual Flowchart Builder | Drag-and-drop node editor with canvas, palette, and inspector |
| Dynamic Validation Engine | Zod-powered, config-driven, isomorphic (client + server) |
| Conditional Logic | Branch form flow with true/false condition paths |
| 13 Field Types | text, email, password, number, tel, url, textarea, dropdown, radio, checkbox, date, rating, file |
| 6 Starter Templates | KYC, Feedback, Event Registration, Support Ticket, Job Application, Contact Form |
| REST API v1 | Full CRUD for forms and submissions with API key authentication |
| API Key Management | SHA-256 hashed, scoped permissions, rotation, revocation |
| Real-time Dashboard | Live form counts, submission stats, and form library |
| Guided Walkthrough | 22-step interactive tour across all 6 app sections |
| Authentication | Database-backed registration, login, and session management |
| Docker Ready | Docker Compose with PostgreSQL for one-command setup |

## Quick Links

- [Installation Guide](./installation) — Set up FormEngine Pro locally
- [Quick Start](./quickstart) — Build your first form in 5 minutes
- [API Reference](../api/authentication) — Full REST API documentation
- [Architecture](../architecture/overview) — Design decisions and technical deep-dive

## Live Demo

The app is deployed at: **https://formengine-pro.onrender.com**

Try it now — register an account, build a form, and submit a response.
