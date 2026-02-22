---
name: api-ticket
description: "Creates Jira tickets for API changes needed by this frontend app. Activates when a feature requires a new API endpoint, a modification to an existing endpoint, or any backend API work. Use when the user mentions needing API changes, new endpoints, API bugs, missing fields, or says 'create an API ticket'."
---

# API Ticket Creation

## When to Apply

Activate this skill when:

- A feature or bug fix requires changes to the external API
- A new API endpoint is needed
- An existing endpoint needs new fields, parameters, or behavior changes
- The user explicitly asks to create an API ticket

## Steps

### 1. Fetch the Current API Documentation

Before creating a ticket, always fetch the latest OpenAPI documentation to understand what already exists:

```bash
curl -s http://192.168.0.193:8000/docs.openapi
```

Parse the YAML response to identify:
- Existing endpoints and their request/response schemas
- Whether the needed functionality already exists
- Related endpoints that may be affected

### 2. Analyze the Gap

Compare what the API currently provides against what the frontend feature needs:
- Identify missing endpoints, fields, or parameters
- Note any response format changes needed
- Reference specific existing endpoints if the change modifies them

### 3. Create the Jira Ticket

Use the Atlassian MCP tool to create the ticket:

- **Cloud ID:** `ikonoverde.atlassian.net`
- **Project Key:** `API`
- **Issue Type:** `Task` (or `Bug` if it's a defect)

The ticket description should include:

1. **Context** - What frontend feature drives this need
2. **Current state** - What the API provides today (reference specific endpoints from the OpenAPI docs)
3. **Required changes** - Clearly describe new endpoints, fields, or modifications needed
4. **Expected request/response format** - Provide example JSON payloads when applicable
5. **Priority/Impact** - Whether this blocks frontend work

### Example Ticket Format

```markdown
## Context
The orders page needs to support filtering by status and date range.

## Current State
`GET /api/orders` returns all orders without filtering support (see OpenAPI docs).

## Required Changes
Add query parameters to `GET /api/orders`:
- `status` (string, optional) - Filter by order status (pending, processing, shipped, delivered, cancelled)
- `from_date` (string, optional) - ISO 8601 date, filter orders created after this date
- `to_date` (string, optional) - ISO 8601 date, filter orders created before this date

## Expected Response
Same response format as current `GET /api/orders`, but filtered.

## Impact
Blocks frontend order filtering feature.
```

### 4. Report Back

After creating the ticket, share the Jira issue key and URL with the user.
