---
slug: /architecture/validation-strategy
title: Validation Strategy
sidebar_label: Validation Strategy
description: Dynamic, config-driven validation with Zod.
---
# Validation Strategy
No hardcoded rules. Zod schemas built at runtime from form config. buildFieldSchema() creates per-field validators. buildFormSchema() assembles them, skipping hidden fields. validateSubmission() returns field-level errors. Runs on both client and server.
