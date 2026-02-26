#!/usr/bin/env node

/**
 * Fetches and parses the OpenAPI documentation from the external API.
 *
 * Usage:
 *   node fetch-api-docs.mjs                          # List all endpoints
 *   node fetch-api-docs.mjs /api/products             # Show specific endpoint
 *   node fetch-api-docs.mjs /api/products /api/categories  # Show multiple endpoints
 *   node fetch-api-docs.mjs --search categories       # Search endpoints by keyword
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve API URL from Laravel config
function getApiUrl() {
    try {
        const envPath = resolve(__dirname, '../../../.env');
        const env = readFileSync(envPath, 'utf-8');
        const match = env.match(/^API_URL=(.+)$/m);
        if (match) return match[1].trim().replace(/["']/g, '');
    } catch {
        // fallback
    }
    return 'http://192.168.0.193:8000';
}

async function fetchOpenApiSpec() {
    const baseUrl = getApiUrl();
    const url = `${baseUrl}/docs.openapi`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch API docs from ${url}: ${res.status} ${res.statusText}`);
    }

    const text = (await res.text()).trimStart();

    // Use js-yaml to parse (available in the project's node_modules)
    const yaml = await import('js-yaml');
    return yaml.load(text);
}

function formatParameter(param) {
    const parts = [
        `    - ${param.name}`,
        `(${param.in})`,
        param.required ? 'REQUIRED' : 'optional',
    ];
    if (param.schema?.type) parts.push(`type: ${param.schema.type}`);
    if (param.schema?.enum) parts.push(`enum: [${param.schema.enum.join(', ')}]`);
    if (param.schema?.default !== undefined) parts.push(`default: ${param.schema.default}`);
    if (param.description) parts.push(`— ${param.description}`);
    return parts.join(' ');
}

function formatSchema(schema, indent = 4) {
    if (!schema) return `${' '.repeat(indent)}(no schema)`;

    const pad = ' '.repeat(indent);
    const lines = [];

    if (schema.oneOf) {
        for (const variant of schema.oneOf) {
            if (variant.description) lines.push(`${pad}${variant.description}:`);
            if (variant.example) {
                lines.push(`${pad}Example: ${JSON.stringify(variant.example, null, 2).split('\n').join('\n' + pad)}`);
            }
            if (variant.properties) {
                lines.push(...formatProperties(variant.properties, indent));
            }
        }
    } else if (schema.properties) {
        lines.push(...formatProperties(schema.properties, indent));
    } else if (schema.example) {
        lines.push(`${pad}Example: ${JSON.stringify(schema.example, null, 2).split('\n').join('\n' + pad)}`);
    } else if (schema.type) {
        lines.push(`${pad}Type: ${schema.type}`);
    }

    return lines.join('\n');
}

function formatProperties(properties, indent = 4) {
    const pad = ' '.repeat(indent);
    const lines = [];
    for (const [key, val] of Object.entries(properties)) {
        const type = val.type || (val.items ? `array<${val.items.type || 'object'}>` : 'unknown');
        let line = `${pad}${key}: ${type}`;
        if (val.description) line += ` — ${val.description}`;
        if (val.example !== undefined && typeof val.example !== 'object') {
            line += ` (example: ${val.example})`;
        }
        lines.push(line);
    }
    return lines;
}

function formatEndpoint(path, method, spec) {
    const lines = [];
    lines.push(`\n${'='.repeat(60)}`);
    lines.push(`${method.toUpperCase()} ${path}`);
    lines.push(`${'='.repeat(60)}`);

    if (spec.summary) lines.push(`Summary: ${spec.summary}`);
    if (spec.description) lines.push(`Description: ${spec.description.trim()}`);
    if (spec.tags?.length) lines.push(`Tags: ${spec.tags.join(', ')}`);

    // Authentication
    const isAuthenticated = spec.security?.some(s => Object.keys(s).length > 0) ??
        spec.tags?.some(t => t !== 'Authentication');
    if (spec.description?.includes('@authenticated') || isAuthenticated) {
        lines.push('Auth: Bearer token required');
    }

    // Parameters
    const params = spec.parameters || [];
    if (params.length > 0) {
        lines.push('\nParameters:');
        for (const param of params) {
            lines.push(formatParameter(param));
        }
    }

    // Request body
    if (spec.requestBody) {
        lines.push('\nRequest Body:');
        const content = spec.requestBody.content || {};
        for (const [contentType, mediaType] of Object.entries(content)) {
            lines.push(`  Content-Type: ${contentType}`);
            if (mediaType.schema) {
                lines.push(formatSchema(mediaType.schema, 4));
            }
        }
    }

    // Responses
    const responses = spec.responses || {};
    for (const [code, response] of Object.entries(responses)) {
        lines.push(`\nResponse ${code}:`);
        if (response.description) lines.push(`  ${response.description}`);
        const content = response.content || {};
        for (const [contentType, mediaType] of Object.entries(content)) {
            lines.push(`  Content-Type: ${contentType}`);
            lines.push(formatSchema(mediaType.schema, 4));
        }
    }

    return lines.join('\n');
}

function listEndpoints(spec) {
    const lines = ['Available API Endpoints:', ''];
    const paths = spec.paths || {};

    for (const [path, methods] of Object.entries(paths)) {
        for (const [method, endpoint] of Object.entries(methods)) {
            if (method === 'parameters') continue;
            const summary = endpoint.summary || '';
            const tags = endpoint.tags?.join(', ') || '';
            lines.push(`  ${method.toUpperCase().padEnd(7)} ${path.padEnd(35)} ${summary}  [${tags}]`);
        }
    }

    return lines.join('\n');
}

function searchEndpoints(spec, keyword) {
    const results = [];
    const paths = spec.paths || {};
    const kw = keyword.toLowerCase();

    for (const [path, methods] of Object.entries(paths)) {
        for (const [method, endpoint] of Object.entries(methods)) {
            const searchable = [
                path,
                endpoint.summary || '',
                endpoint.description || '',
                ...(endpoint.tags || []),
            ].join(' ').toLowerCase();

            if (searchable.includes(kw)) {
                results.push(formatEndpoint(path, method, endpoint));
            }
        }
    }

    return results.length > 0
        ? results.join('\n')
        : `No endpoints found matching "${keyword}"`;
}

async function main() {
    const args = process.argv.slice(2);

    try {
        const spec = await fetchOpenApiSpec();

        // No arguments: list all endpoints
        if (args.length === 0) {
            console.log(listEndpoints(spec));
            return;
        }

        // --search flag: keyword search
        if (args[0] === '--search') {
            const keyword = args.slice(1).join(' ');
            if (!keyword) {
                console.error('Usage: fetch-api-docs.mjs --search <keyword>');
                process.exit(1);
            }
            console.log(searchEndpoints(spec, keyword));
            return;
        }

        // Specific endpoint paths
        const paths = spec.paths || {};
        for (const requestedPath of args) {
            const methods = paths[requestedPath];
            if (!methods) {
                console.log(`\nEndpoint not found: ${requestedPath}`);
                // Suggest similar paths
                const similar = Object.keys(paths).filter(p =>
                    p.includes(requestedPath.replace('/api/', ''))
                );
                if (similar.length > 0) {
                    console.log(`  Did you mean: ${similar.join(', ')}?`);
                }
                continue;
            }

            for (const [method, endpoint] of Object.entries(methods)) {
                console.log(formatEndpoint(requestedPath, method, endpoint));
            }
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

main();
