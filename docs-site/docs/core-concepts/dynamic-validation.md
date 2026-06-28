---
slug: /core-concepts/dynamic-validation
title: Dynamic Validation
sidebar_label: Dynamic Validation
description: How the config-driven validation engine works with Zod — no hardcoded rules.
---

# Dynamic Validation

The validation engine is the heart of FormEngine Pro. Instead of hardcoding rules like `if (age < 18)`, rules are stored in the form config and evaluated at runtime using [Zod](https://zod.dev).

## Architecture

```
Form Config (JSON)
    │
    ▼
validation-engine.ts
    │
    ├── buildFieldSchema(field)  → Zod type per field
    ├── buildFormSchema(schema)  → z.object({...}) excluding hidden fields
    └── validateSubmission()     → { valid, errors }
```

## How It Works

### 1. `buildFieldSchema(field)`

Reads the field's type and validation rules, returns a Zod type:

```typescript
// For a text field with minLength=3, maxLength=20, pattern=^[A-Z]+$
let s = z.string()
  .min(3, "Must be at least 3 characters")
  .max(20, "Must be at most 20 characters")
  .regex(/^[A-Z]+$/, "Only uppercase letters");
```

### 2. `buildFormSchema(schema, values)`

Builds a complete `z.object({...})`, but **skips fields hidden by conditional logic**:

```typescript
for (const field of schema.fields) {
  if (!isFieldVisible(field, values)) continue;
  shape[field.id] = buildFieldSchema(field);
}
return z.object(shape);
```

### 3. `validateSubmission(schema, data)`

The main entry point — runs `safeParse()` and returns field-level errors:

```typescript
const zodSchema = buildFormSchema(schema, data);
const result = zodSchema.safeParse(data);
if (result.success) return { valid: true, errors: {} };
// Flatten Zod's error tree into { fieldId: message }
```

## Supported Rules

| Rule | Field Types | Description |
|------|------------|-------------|
| `required` | All | Field must have a value |
| `minLength` | text, textarea, email, password, tel, url | Minimum string length |
| `maxLength` | text, textarea, email, password, tel, url | Maximum string length |
| `pattern` | text, password, tel | Regex with custom error message |
| `min` | number | Minimum numeric value |
| `max` | number | Maximum numeric value |
| `minDate` | date | Earliest allowed date (ISO string) |
| `maxDate` | date | Latest allowed date (ISO string) |
| `min` (checkbox) | checkbox | Minimum selections |
| `max` (checkbox) | checkbox | Maximum selections |

### Auto-validated types

- `email` — Zod's `.email()` validates format automatically
- `url` — Zod's `.url()` validates format automatically
- `dropdown`/`radio` — `z.enum([...options])` ensures value is in the options list

## Isomorphic

The same `validateSubmission()` function runs on:

- **Client** (`public-form-renderer.tsx`) — instant feedback, red error text under each field, no network round-trip
- **Server** (`/api/submissions` and `/api/v1/forms/[shareId]/submissions`) — security, never trust client input

Both use the exact same code, so there's no risk of validation drift.

## Example

```typescript
import { validateSubmission } from '@/lib/flowchart/validation-engine';

const result = validateSubmission(schema, {
  email: 'not-an-email',
  age: 5
});
// → {
//     valid: false,
//     errors: {
//       email: 'Invalid email format',
//       age: 'Must be at least 18'
//     }
//   }
```

## Conditional Visibility

When a field is hidden by a condition, it's **excluded from the Zod schema entirely** — it won't trigger "required" errors even if marked required. This is handled by `isFieldVisible()` which evaluates the condition operators: `==`, `!=`, `>`, `<`, `contains`, `empty`, `not_empty`.
