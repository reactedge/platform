import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseConfig } from "../src/bootstrap/config/ConfigSchema.ts";
import { parseRuntimeConfig } from "../src/bootstrap/config/ConfigSchemaRuntime.ts";

test("contracts configure the service base URL and widget map defaults", () => {
  const contract = JSON.parse(readFileSync(new URL("../public/default.json", import.meta.url), "utf8"));
  const runtime = JSON.parse(readFileSync(new URL("../public/reactedge-runtime.json", import.meta.url), "utf8"));
  const config = parseConfig(contract);
  const integrations = parseRuntimeConfig(runtime).integrations;

  assert.deepEqual(config.data.defaultCenter, { lat: 52.3555, lng: -1.1743 });
  assert.deepEqual(contract.integration.requires, ["evchargerfinderApi"]);
  assert.equal(integrations.evchargerfinderApi.api, "http://localhost:4182");
});

test("runtime validation requires a valid ReactEdge service URL", () => {
  assert.throws(() => parseRuntimeConfig({ integrations: { evchargerfinderApi: { api: "bad url" } } }));
});
