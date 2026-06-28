---
slug: /core-concepts/form-configuration
title: Form Configuration
sidebar_label: Form Configuration
description: How forms are stored as dynamic JSON configurations instead of hardcoded tables.
---

# Form Configuration

FormEngine Pro stores forms as **dynamic JSON configurations** — not hardcoded database tables. This means you can add fields, change types, update validation rules, and add conditional logic without writing code or running migrations.

## The Flowchart

Each form has a **flowchart** — a directed graph of nodes connected by edges:

```json
{
  "nodes": [
    {
      "id": "n1",
      "type": "start",
      "position": { "x": 80, "y": 240 },
      "data": { "label": "Start" }
    },
    {
      "id": "n2",
      "type": "field",
      "position": { "x": 360, "y": 220 },
      "data": {
        "label": "Email Address",
        "fieldType": "email",
        "required": true,
        "validation": { "required": true }
      }
    },
    {
      "id": "n3",
      "type": "submit",
      "position": { "x": 680, "y": 240 },
      "data": { "label": "Submit" }
    }
  ],
  "edges": [
    { "id": "e1", "source": "n1", "target": "n2" },
    { "id": "e2", "source": "n2", "target": "n3" }
  ]
}
```

## Node Types

| Type | Purpose | Has Input | Has Output |
|------|---------|-----------|------------|
| `start` | Entry point — one per form | No | Yes |
| `field` | User input — 13 types available | Yes | Yes |
| `condition` | Branching logic — true/false paths | Yes | Yes (T + F) |
| `submit` | Form submission action | Yes | Yes |
| `end` | Terminal node | Yes | No |

## Field Types

13 field types are supported, each with type-specific validation:

| Type | HTML Input | Validation Options |
|------|-----------|-------------------|
| `text` | `<input type="text">` | required, minLength, maxLength, pattern |
| `email` | `<input type="email">` | required, email format (auto-validated) |
| `password` | `<input type="password">` | required, minLength, maxLength, pattern |
| `number` | `<input type="number">` | required, min, max |
| `tel` | `<input type="tel">` | required, pattern |
| `url` | `<input type="url">` | required, URL format (auto-validated) |
| `textarea` | `<textarea>` | required, minLength, maxLength |
| `dropdown` | `<select>` | required, enum (options) |
| `radio` | `<input type="radio">` | required, enum (options) |
| `checkbox` | `<input type="checkbox">` | required, min/max selections |
| `date` | `<input type="date">` | required, minDate, maxDate |
| `rating` | Star rating (1-5) | required |
| `file` | `<input type="file">` | required |

## The Generated Schema

When you publish a form, the flowchart is converted into a **generated schema** — a flat list of fields with their validation rules and conditional logic:

```json
{
  "schema_name": "Contact Form",
  "version": "1.0.0",
  "generated_at": "2026-06-28T12:00:00.000Z",
  "fields": [
    {
      "id": "n2",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "validation": { "required": true }
    }
  ],
  "logic": []
}
```

This schema is what the validation engine and public form renderer consume. It's stored in the `Form.schema` column as JSON.

## Validation Rules Object

Each field can have a `validation` object:

```typescript
interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;          // Regex
  patternMessage?: string;   // Custom error for pattern
  min?: number;              // Numeric min OR checkbox min selections
  max?: number;              // Numeric max OR checkbox max selections
  minDate?: string;          // ISO date string
  maxDate?: string;          // ISO date string
  errorMessage?: string;     // Override all default messages
}
```

## Why JSON Instead of Normalized Tables?

If fields were normalized into a `FormField` table (`formId`, `fieldName`, `fieldType`, `required`, `minLength`, ...), every form edit would require multi-row inserts/updates/deletes. By storing the entire flowchart as JSON:

- **Atomic updates** — saving a form is one row write
- **Single-read loading** — one query returns the full form definition
- **Schema evolution** — adding a new validation rule requires zero database migrations
- **Conditional logic** — edges and conditions are part of the same document

This is the same pattern PostgreSQL's `JSONB` column enables.
