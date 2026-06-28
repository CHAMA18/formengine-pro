---
slug: /architecture/database-schema
title: Database Schema
sidebar_label: Database Schema
description: Prisma models and JSON storage strategy.
---
# Database Schema
5 models: User (auth), Session (cookies), Form (flowchart + schema as JSON), Submission (data as JSON), ApiKey (hashed keys). JSON columns enable dynamic form structure without migrations.
