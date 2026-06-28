---
slug: /architecture/design-decisions
title: Design Decisions
sidebar_label: Design Decisions
description: Why we chose SQLite/PostgreSQL, JSON columns, and Zod.
---
# Design Decisions
**Database**: JSON columns for dynamic form structure — atomic updates, single-read loading, schema evolution without migrations. **Validation**: Zod for runtime schema construction, isomorphic execution, TypeScript inference. **Routing**: Separation of internal API (/api) and public REST API (/api/v1).
