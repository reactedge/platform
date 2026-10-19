import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { parseConfig } from "../src/ConfigSchema.ts";
import { parseRuntimeConfig } from "../src/ConfigSchemaRuntime.ts";
import {
    BeachFinderApiError,
    createBeachFinderApiClient,
} from "../src/services/beachfinder/BeachFinderApi.ts";

const sample = {
    postcode: "BN1 1AA",
    radiusMiles: 10,
    beaches: [{
        id: "node-7",
        name: "Brighton Beach",
        latitude: 50.8198,
        longitude: -0.1367,
        distanceMiles: 0.8,
    }],
};

test("public widget and runtime JSON satisfy their schemas", async () => {
    const contract = JSON.parse(await readFile(new URL("../public/default.json", import.meta.url), "utf8"));
    const runtime = JSON.parse(await readFile(new URL("../public/reactedge-runtime.json", import.meta.url), "utf8"));

    assert.equal(parseConfig(contract).data.title, "Find a beach near you");
    assert.equal(parseRuntimeConfig(runtime).integrations.beachfinderApi.api, "http://127.0.0.1:4185");
});

test("search sends encoded postcode and radius to the configured service", async () => {
    let requestedUrl = "";
    const client = createBeachFinderApiClient("https://beaches.example.test/", async (input) => {
        requestedUrl = String(input);
        return Response.json(sample);
    });

    assert.deepEqual(await client.search(" BN1 1AA ", 10), sample);
    assert.equal(requestedUrl, "https://beaches.example.test/beachfinder/beaches?postcode=BN1+1AA&radiusMiles=10");
});

test("search presents distinct invalid postcode, unknown postcode and service errors", async (context) => {
    const cases = [
        { status: 400, message: "Enter a valid UK postcode and a radius up to 100 miles." },
        { status: 404, message: "That postcode could not be found. Check it and try again." },
        { status: 502, message: "Beach search is temporarily unavailable. Please try again." },
    ];
    for (const scenario of cases) {
        await context.test(`HTTP ${scenario.status}`, async () => {
            const client = createBeachFinderApiClient("http://localhost:4185", async () =>
                new Response(null, { status: scenario.status })
            );
            await assert.rejects(
                client.search("BN1 1AA", 10),
                (error: unknown) => error instanceof BeachFinderApiError
                    && error.status === scenario.status
                    && error.message === scenario.message
            );
        });
    }
});

test("search rejects malformed successful payloads", async () => {
    const client = createBeachFinderApiClient("http://localhost:4185", async () =>
        Response.json({ ...sample, beaches: [{ id: "bad", latitude: 0 }] })
    );
    await assert.rejects(client.search("BN1 1AA", 10), { status: 502 });
});

test("aborted requests retain cancellation for the caller", async () => {
    const controller = new AbortController();
    controller.abort();
    const client = createBeachFinderApiClient("http://localhost:4185", async (_input, init) => {
        assert.equal(init?.signal?.aborted, true);
        throw new DOMException("Aborted", "AbortError");
    });
    await assert.rejects(client.search("BN1 1AA", 10, controller.signal), { name: "AbortError" });
});
