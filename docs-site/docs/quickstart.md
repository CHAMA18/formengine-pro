---
slug: /quickstart
title: Quick Start
sidebar_label: Quick Start
description: Build and publish your first form in 5 minutes.
---

# Quick Start

Build your first dynamic form in 5 minutes. This guide walks you through creating a form, adding validation, publishing, and collecting submissions.

## Step 1: Create an Account

1. Go to **http://localhost:3000/signup**
2. Enter your name, email, and password
3. Click **Create Account**
4. You're automatically logged in and redirected to the dashboard

## Step 2: Open the Flowchart Builder

1. From the dashboard, click **Create Form**
2. The builder opens with a default flow: Start → Full Name → Submit → End

## Step 3: Add Fields

1. From the **Node Palette** (left sidebar), click **Input Field** to add a new node
2. Click the new node to select it
3. In the **Inspector** (right sidebar), configure:
   - **Label**: `Email Address`
   - **Field Type**: `Email`
   - **Required**: Toggle ON
4. Drag from the **Full Name** node's output handle (right side) to the **Email Address** node's input handle (left side)
5. Drag from **Email Address**'s output to **Submit**'s input

## Step 4: Add Validation

1. Select the **Full Name** node
2. In the Inspector, expand **Validation Rules**
3. Set **Min Length**: `2`
4. Set **Max Length**: `100`

The JSON schema on the right updates in real time.

## Step 5: Publish

1. Click **Deploy Schema** (top right)
2. Review the summary (2 fields, 0 conditions)
3. Click **Publish & Generate Link**
4. Copy the shareable URL

## Step 6: Collect Submissions

1. Open the shareable URL in a new tab
2. Fill in the form and click **Submit**
3. Go to **Submissions** in the sidebar — your response appears instantly

## Next Steps

- [Add conditional logic](../guides/conditional-logic) to branch your form
- [Integrate via the REST API](../guides/integrate-via-api) to create forms programmatically
- [Browse starter templates](../features/starter-templates) for pre-built forms
