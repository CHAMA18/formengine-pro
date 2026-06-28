---
slug: /features/api-keys
title: API Keys
sidebar_label: API Keys
description: Scoped, rotatable API keys.
---
# API Keys
SHA-256 hashed at rest. 4 scopes: forms:read, forms:write, submissions:read, submissions:write. Write implies read. Rotate instantly. Revoke permanently. Auth via Authorization: Bearer or x-api-key header.
