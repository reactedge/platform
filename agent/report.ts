import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Row } from './index.js';

export type Report = {
    environment: string;
    store?: string;
    results: Row[];
    error?: string;
    summary: { checked: number; passed: number; failed: number; errors: number; skipped: number };
    outcome: string;
};

function escape(value: unknown): string {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
}

// Pure export: no MCP calls, report mutation, or interpretation of raw log text.
export function renderHtml(report: Report): string {
    const rows = report.results.map(row => {
        const result = row.result ?? {};
        const timedOut = result.timedOut === true;
        const status = timedOut ? 'TIMEOUT' : row.status;
        const tests = result.tests as { passed?: unknown; failed?: unknown } | undefined;
        const counts = timedOut ? 'Incomplete — run interrupted' : tests
            ? `${escape(tests.passed)} passed / ${escape(tests.failed)} failed` : '—';
        const tone = timedOut ? 'timeout' : row.status === 'PASS' ? 'pass' : row.status === 'SKIP' ? 'skip' : 'fail';
        return `<tr><th scope="row">${escape(row.instance)}</th><td>${escape(result.check ?? 'unknown')}</td>
<td><span class="badge ${tone}">${escape(status)}</span></td><td>${counts}</td>
<td><p>${escape(row.detail)}</p><details><summary>Details and logs</summary><pre>${escape(JSON.stringify(result, null, 2))}</pre>
${typeof result.output === 'string' ? `<h3>Command output</h3><pre>${escape(result.output)}</pre>` : ''}</details></td></tr>`;
    }).join('\n');
    const timeouts = report.results.filter(row => row.result?.timedOut === true).length;
    return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ReactEdge verification report</title><style>
:root{font-family:system-ui,sans-serif;color:#222;background:#f4f5f7}body{max-width:1200px;margin:40px auto;padding:0 24px}h1{font-size:28px;margin-bottom:8px}.meta{color:#555}.summary{display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}.summary div{background:white;padding:16px 24px;border:1px solid #ddd;border-radius:8px}.summary strong{display:block;font-size:26px}.table{overflow:auto;background:white;border:1px solid #ddd;border-radius:8px}table{border-collapse:collapse;width:100%;text-align:left}th,td{padding:14px;border-bottom:1px solid #ddd;vertical-align:top}thead{background:#eaecef}p{margin:0 0 10px}.badge{display:inline-block;font-size:12px;font-weight:700;padding:5px 8px;border-radius:4px}.pass{background:#ddf2e4;color:#165c31}.fail{background:#fbe1e1;color:#862020}.timeout{background:#fff0cc;color:#725000}.skip{background:#e8edf5;color:#354a70}summary{cursor:pointer;color:#354a70}pre{white-space:pre-wrap;overflow-wrap:anywhere;max-width:650px;font-size:12px;background:#f4f5f7;padding:12px}footer{margin-top:20px;color:#555}.error{padding:16px;background:#fbe1e1}
</style></head><body><h1>ReactEdge verification report</h1>
<p class="meta">Environment: ${escape(report.environment)} · Store: ${escape(report.store ?? 'unavailable')} · Outcome: ${escape(report.outcome)}</p>
<div class="summary"><div><strong>${escape(report.summary.checked)}</strong>Checks</div><div><strong>${escape(report.summary.passed)}</strong>Passed</div><div><strong>${escape(report.summary.failed)}</strong>Failed, including ${timeouts} timeouts</div><div><strong>${escape(report.summary.errors)}</strong>Check errors</div><div><strong>${escape(report.summary.skipped)}</strong>Skipped</div></div>
${report.error ? `<p class="error">Run error: ${escape(report.error)}</p>` : ''}
${rows ? `<div class="table"><table><thead><tr><th>Widget</th><th>Check</th><th>Status</th><th>Tests</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table></div>` : '<p>No check results were recorded.</p>'}
<footer>Only ready active widgets are built and tested. Unready widgets are retained as skipped readiness evidence. Timeout counts are incomplete; raw verifier results remain unchanged in JSON and details.</footer></body></html>`;
}

export async function exportReport(report: Report, directory: string): Promise<string> {
    await mkdir(directory, { recursive: true });
    // A separate directory per run preserves history and avoids filename collisions.
    const { mkdtemp } = await import('node:fs/promises');
    const runDirectory = await mkdtemp(join(directory, 'run-'));
    await writeFile(join(runDirectory, 'report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
    await writeFile(join(runDirectory, 'report.html'), renderHtml(report), 'utf8');
    return runDirectory;
}
