import {run} from "node:test";

if (process.env.ALLOW_SELF_SIGNED_SSL === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
import 'dotenv/config';
import express from 'express';
import {buildRenderPayload} from "./payload";
import {SsrRenderOperation} from "./ssr-operation";

const app = express();
app.use(express.json());

function resolveEntry(widget: string): string {
    return `${process.env.SSR_WIDGET_ROOT}/${widget}/vite_project/src/ssr/entry.tsx`;
}

const operation = new SsrRenderOperation();

app.post('/render', async (req, res) => {
    try {
        operation.registerStart(req.headers)

        const payload =
            await buildRenderPayload({
                ...req.body,
                runtimeConfig: {
                    ...req.body.runtimeConfig,
                    userAgent: req.headers['user-agent']
                }
            });

        operation.logPayload(payload);

        const entry = resolveEntry(payload.widget);
        const {renderHtml, buildBootstrap} = await import(entry);

        const bootstrapData =
            buildBootstrap
                ? await buildBootstrap(
                    payload.contract,
                    payload.runtimeConfig
                )
                : undefined;

        const html = renderHtml(payload.contract, payload.runtimeConfig, bootstrapData);

        operation.lodCompletion(html.length)

        res
            .set('X-SSR-Worker', 'local')
            .set('X-SSR-Cache', 'MISS')
            .send(`
            <!-- SSR:${operation.getRequestId()} -->
            ${html}
        `);

    } catch (e) {
        operation.logFailedSsr(e)
    }
});

app.listen( process.env.SSR_PORT, '0.0.0.0', () => {
    console.log(`Widgets SSR runtime listening on :${process.env.SSR_PORT}`);
    console.log('Widgets SSR runtime WIDGETS_CDN_URL', process.env.WIDGETS_CDN_URL);
    console.log('Widgets ROOT SSR_WIDGET_ROOT', process.env.SSR_WIDGET_ROOT);
});