---
name: Fetch API Docs
description: >-
  This skill should be used when the user asks to "fetch the API docs",
  "check the API endpoint", "look up the API", "what parameters does the API accept",
  or when implementing features that depend on external API endpoints. Also activates
  when working on Jira tickets that reference API dependencies (e.g., "Requires API-10"),
  or when needing to verify request/response schemas for ProductService, OrderService,
  CartService, or any ApiClient-based service calls.
---

# Fetch API Documentation

Retrieve endpoint details from the external API's OpenAPI 3.0.3 specification.

The mobile app is a thin client that proxies all data through an external API via `ApiClient`. The API serves its OpenAPI documentation at the `/docs.openapi` endpoint. This skill provides a Node.js script that fetches, parses, and formats endpoint details on demand.

## Script Location

`scripts/fetch-api-docs.mjs` — A Node.js script using `js-yaml` (already available in the project's `node_modules`).

## Usage

Run from the project root (`mobile/`):

```bash
# List all available endpoints
node .claude/skills/fetch-api-docs/scripts/fetch-api-docs.mjs

# Get details for specific endpoints (path, parameters, request body, responses)
node .claude/skills/fetch-api-docs/scripts/fetch-api-docs.mjs /api/products /api/categories

# Search endpoints by keyword
node .claude/skills/fetch-api-docs/scripts/fetch-api-docs.mjs --search checkout
```

## When to Use

- Before implementing a new feature that calls an API endpoint, fetch its docs to confirm the available parameters, request body schema, and response format.
- When a Jira ticket references API dependencies (e.g., "Requires API-11: GET /api/categories"), fetch those endpoints to understand the contract.
- When adding query parameters to an `ApiClient` call, verify the parameter names and types match the API spec.
- When debugging unexpected API responses, compare the actual response against the documented schema.

## Procedure

1. Identify which API endpoints the current task depends on.
2. Run the script with those endpoint paths to retrieve full documentation.
3. Use the output to inform service method signatures, controller parameters, and TypeScript types.

## Output Format

For each endpoint, the script outputs:
- **Method and path** (e.g., `GET /api/products`)
- **Summary and description**
- **Parameters** with name, location (query/path), required/optional, type, enum values, and defaults
- **Request body** schema and content type
- **Response** schemas per status code with examples

## API URL Resolution

The script reads `API_URL` from the project's `.env` file. Falls back to `http://192.168.0.193:8000` if not found.
