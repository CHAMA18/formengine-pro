---
slug: /guides/deploy-on-render
title: Deploy on Render
sidebar_label: Deploy on Render
description: Deploy FormEngine Pro to Render with PostgreSQL.
---
# Deploy on Render
1. Create a PostgreSQL database on Render (free plan) 2. Create a web service from the GitHub repo 3. Set DATABASE_URL env var to the Render PostgreSQL connection string 4. Set build command: npm install && npx prisma generate && npm run build 5. Set start command: npx prisma db push && npx next start
