import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseConfig } from "../src/bootstrap/config/ConfigSchema.ts";
import { parseRuntimeConfig } from "../src/bootstrap/config/ConfigSchemaRuntime.ts";

test("widget and runtime contracts provide UK map and API defaults", () => {
  const contract = JSON.parse(readFileSync(new URL("../public/default.json", import.meta.url), "utf8"));
  const runtime = JSON.parse(readFileSync(new URL("../public/reactedge-runtime.json", import.meta.url), "utf8"));
  const config = parseConfig(contract);
  const integrations = parseRuntimeConfig(runtime).integrations;

  assert.deepEqual(config.data.defaultCenter, { lat: 52.3555, lng: -1.1743 });
  assert.equal(integrations.openChargeMapApi.api, "https://api.openchargemap.io/v3/poi/");
  assert.equal(integrations.ukPostcodesApi.api, "https://api.postcodes.io/postcodes/");
});

test("config rejects non-UK map coordinates and malformed API URLs", () => {
  assert.throws(() => parseConfig({ data: { defaultCenter: { lat: 42, lng: -1 } } }));
  assert.throws(() => parseRuntimeConfig({ integrations: { openChargeMapApi: { api: "not a URL" }, ukPostcodesApi: { api: "https://api.postcodes.io/postcodes/" } } }));
});
