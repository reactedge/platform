import 'dotenv/config';
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && process.env.ALLOW_SELF_SIGNED_SSL === 'true') {
    throw new Error(
        'ALLOW_SELF_SIGNED_SSL must not be enabled in production.'
    );
}

if (process.env.ALLOW_SELF_SIGNED_SSL === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import express from 'express';
import { buildRenderPayload } from "./payload";
import {createOperations} from "./observability/ssr-operation";
import { resolveDevice } from "./user-agent";
import {ReactEdgeRoot} from "@reactedge/filesystem/reactedgeRoot.ts";

const app = express();
app.use(express.json());

function resolveEntry(widget: string): string {
    return `${ReactEdgeRoot.get()}/widgets/${widget}/src/bootstrap/ssr/render.tsx`;
}

app.post('/render', async (req, res) => {
    const observabilityEnabled =
        req.body.options?.observability === true;

    const {
        render: ssrOperation
    } = createOperations(observabilityEnabled);
    ssrOperation.registerStart(req.headers);

    try {
        const payload =
            await buildRenderPayload({
                ...req.body,
                runtimeConfig: req.body.runtimeConfig,
                ssrContext: {
                    userAgent: resolveDevice(req.headers['user-agent'])
                }
            });

        ssrOperation.logPayload(payload);

        const entry = resolveEntry(payload.widget);

        const { renderHtml, buildBootstrap } = await import(entry);

        ssrOperation.logWidgetImported();

        const bootstrap =
            buildBootstrap
                ? await buildBootstrap(payload.runtimeConfig)
                : undefined;

        ssrOperation.logRenderingStarted();

        const html = renderHtml(payload.contract, payload.runtimeConfig, bootstrap);

        ssrOperation.logCompletion(html.length)

        res
            .set('X-SSR-Worker', 'local')
            .set('X-SSR-Cache', 'MISS')
            .send(`
            <!-- SSR:${ssrOperation.getRequestId()} -->
            ${html}
        `);

        ssrOperation.logResponseSent()
    } catch (e) {
        ssrOperation.logFailedSsr(e)
    }
});

app.listen(process.env.SSR_PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`Widgets SSR runtime listening on :${process.env.SSR_PORT}`);
    // eslint-disable-next-line no-console
    console.log(
        `[SSR] listening on :${process.env.SSR_PORT} (TLS validation ${
            process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0'
                ? 'disabled'
                : 'enabled'
        })`
    );
});
