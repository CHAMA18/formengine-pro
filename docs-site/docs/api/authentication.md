---
slug: /api/authentication
title: API Authentication
sidebar_label: Authentication
description: How to authenticate with the REST API.
---
# API Authentication
All /api/v1/ endpoints require an API key. Pass via `Authorization: Bearer fep_live_...` or `x-api-key: fep_live_...` header. Create keys at /api-keys. 4 scopes: forms:read, forms:write, submissions:read, submissions:write.
