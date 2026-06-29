import { run } from "node:test";

if (process.env.ALLOW_SELF_SIGNED_SSL === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
import 'dotenv/config';
import express from 'express';
import { buildRenderPayload } from "./payload";
import { SsrRenderOperation } from "./observability/ssr-operation";
import { LockOperation } from "./observability/lock-operation";
import { resolveDevice } from "./user-agent";
import { withRenderLock } from "./lock";

const app = express();
app.use(express.json());

function resolveEntry(widget: string): string {
    return `${process.env.SSR_WIDGET_ROOT}/${widget}/src/ssr/entry.tsx`;
}

app.post('/render', async (req, res) => {
    const ssrOperation = new SsrRenderOperation();
    ssrOperation.registerStart(req.headers);

    const lockOperation = new LockOperation(ssrOperation);

    await withRenderLock(lockOperation, async () => {
        try {
            const payload =
                await buildRenderPayload({
                    ...req.body,
                    runtimeConfig: {
                        ...req.body.runtimeConfig,
                        userAgent: resolveDevice(req.headers['user-agent'])
                    }
                });

            ssrOperation.logPayload(payload);

            const entry = resolveEntry(payload.widget);
            const { renderHtml, buildBootstrap } = await import(entry);

            ssrOperation.logWidgetImported();

            const bootstrapData =
                buildBootstrap
                    ? await buildBootstrap(
                        payload.contract,
                        payload.runtimeConfig
                    )
                    : undefined;

            ssrOperation.logRenderingStarted();

            const html = renderHtml(payload.contract, payload.runtimeConfig, bootstrapData);

            ssrOperation.logCompletion(html.length)

            res
                .set('X-SSR-Worker', 'local')
                .set('X-SSR-Cache', 'MISS')
                .send(`
                <!-- SSR:${ssrOperation.getRequestId()} -->
                ${html}
            `);

            ssrOperation.logResponseSent(lockOperation.getWaitingLock())
        } catch (e) {
            ssrOperation.logFailedSsr(e)
        }
    });
});

app.listen(process.env.SSR_PORT, '0.0.0.0', () => {
    console.log(`Widgets SSR runtime listening on :${process.env.SSR_PORT}`);
    console.log('Widgets SSR WIDGETS_CONTRACT_PATH', process.env.WIDGETS_CONTRACT_PATH);
    console.log('Widgets ROOT SSR_WIDGET_ROOT', process.env.SSR_WIDGET_ROOT);
});