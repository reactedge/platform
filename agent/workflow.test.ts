import assert from 'node:assert/strict';
import test from 'node:test';
import { runWorkflow } from './workflow.js';
import type { Row } from './index.js';

function object(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function message(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

test('verifies only active widgets whose readiness passed', async () => {
    const calls: Array<{ name: string; args: Record<string, unknown> }> = [];
    const report: { store?: string; results: Row[] } = { results: [] };

    await runWorkflow({
        report,
        object,
        message,
        call: async (name, args) => {
            calls.push({ name, args });
            if (name === 'list_active_widgets') {
                return {
                    isError: false,
                    data: {
                        store: 'default',
                        count: 2,
                        widgets: [
                            {
                                id: 'usp',
                                active: true,
                                ready: { passed: true, requirements: [] },
                            },
                            {
                                id: 'googlereviews',
                                active: true,
                                ready: {
                                    passed: false,
                                    requirements: [
                                        { requirement: 'GOOGLE_PLACE_ID', passed: false },
                                    ],
                                    error: 'Missing GOOGLE_PLACE_ID',
                                },
                            },
                        ],
                    },
                };
            }

            assert.equal(name, 'verify_active_widget');
            assert.equal(args.instance, 'usp');
            return {
                isError: false,
                data: {
                    instance: 'usp',
                    store: 'default',
                    check: args.check,
                    passed: true,
                },
            };
        },
    });

    assert.deepEqual(calls, [
        { name: 'list_active_widgets', args: {} },
        { name: 'verify_active_widget', args: { instance: 'usp', check: 'build' } },
        { name: 'verify_active_widget', args: { instance: 'usp', check: 'test' } },
    ]);

    assert.equal(report.results.length, 3);
    assert.deepEqual(report.results.map(row => [row.instance, row.status]), [
        ['usp', 'PASS'],
        ['usp', 'PASS'],
        ['googlereviews', 'SKIP'],
    ]);
    assert.match(report.results[2].detail, /GOOGLE_PLACE_ID/);
});
