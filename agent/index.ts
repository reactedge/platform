import { exportReport } from './report.js';
import { runWorkflow } from './workflow.js';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Fixed first goal: verify the build and tests of every ready active widget in one environment.
// Run from the platform root: npm --prefix agent start -- default
const environment = process.argv[2] ?? 'default';
const root = fileURLToPath(new URL('../', import.meta.url));
const client = new Client({ name: 'reactedge-hello-world-agent', version: '0.1.0' });
const transport = new StdioClientTransport({
    command: process.execPath,
    args: ['--import', 'tsx', resolve(root, 'mcp/server.ts'), environment],
    cwd: root,
    stderr: 'inherit',
});

export type Row = {
    instance: string;
    status: 'PASS' | 'FAIL' | 'ERROR' | 'SKIP';
    detail: string;
    result?: Record<string, unknown>;
};
const report: { environment: string; store?: string; results: Row[]; error?: string } = {
    environment,
    results: [],
};

function object(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function message(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

async function call(name: string, args: Record<string, unknown>) {
    console.error(`Calling ${name} ${JSON.stringify(args)}`);
    const response = await client.callTool(
        { name, arguments: args },
        { timeout: 60_000 },
    );
    // The existing ReactEdge tools return JSON in a text content block.
    const text = response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('\n');
    let data: unknown;
    try {
        data = response.structuredContent ?? JSON.parse(text);
    } catch {
        throw new Error(`${name} returned non-JSON content: ${text}`);
    }
    if (!object(data)) throw new Error(`${name} returned an invalid object`);
    return { data, isError: response.isError === true };
}

try {
    await client.connect(transport);
    await runWorkflow({ call, report, object, message });
} catch (error) {
    report.error = message(error);
} finally {
    try {
        await client.close();
    } catch (error) {
        report.error = [report.error, `MCP cleanup failed: ${message(error)}`].filter(Boolean).join('; ');
    }

    const checked = report.results.filter(row => row.status !== 'SKIP');
    const skipped = report.results.filter(row => row.status === 'SKIP');
    const completedReport = {
        ...report,
        summary: {
            checked: checked.length,
            passed: checked.filter(row => row.status === 'PASS').length,
            failed: checked.filter(row => row.status === 'FAIL').length,
            errors: checked.filter(row => row.status === 'ERROR').length,
            skipped: skipped.length,
        },
        outcome: report.error ? 'ERROR' :
            report.results.length === 0 ? 'NO_ACTIVE_WIDGETS' :
            checked.length === 0 ? 'NO_READY_WIDGETS' :
            checked.some(row => row.status === 'FAIL' || row.status === 'ERROR') ? 'FAIL' :
            skipped.length > 0 ? 'PARTIAL' : 'PASS',
    };
    console.log(JSON.stringify(completedReport, null, 2));
    process.exitCode = report.error || checked.some(row => row.status === 'FAIL' || row.status === 'ERROR') ? 1 : 0;
    try {
        const directory = await exportReport(completedReport, resolve(root, 'artifacts', 'agent'));
        console.error(`Reports saved: ${directory}/report.json and ${directory}/report.html`);
    } catch (error) {
        console.error(`Report export failed: ${message(error)}`);
        process.exitCode = 1;
    }
}
