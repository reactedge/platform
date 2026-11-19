import assert from "node:assert/strict";
import { test } from "node:test";
import { ChargingStationApiError, ChargingStationService } from "../src/domain/charging-station.service.ts";
import type { EVChargerFinderConfig } from "../src/domain/ev-charger.types.ts";

const config: EVChargerFinderConfig = {
  data: { defaultCenter: { lat: 52.35, lng: -1.17 }, zoom: 6 },
  integrations: {
    openChargeMapApi: { api: "https://api.openchargemap.io/v3/poi/" },
    ukPostcodesApi: { api: "https://api.postcodes.io/postcodes/" },
  },
};

test("search resolves a postcode and maps charging point details", async () => {
  const requests: string[] = [];
  const fetcher: typeof fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    if (url.includes("postcodes.io")) return Response.json({ status: 200, result: { latitude: 51.5, longitude: -0.12 } });
    return Response.json([{
      ID: 7,
      AddressInfo: { Title: "Central Charge", AddressLine1: "1 High Street", Town: "London", Postcode: "SW1A 1AA", Latitude: 51.51, Longitude: -0.11, Distance: 1.2 },
      Connections: [{ ConnectionType: { Title: "CCS" }, PowerKW: 150, Quantity: 2 }],
      StatusType: { IsOperational: true },
    }]);
  };
  const controller = new AbortController();
  const result = await new ChargingStationService(config, fetcher).search("SW1A 1AA", 10, controller.signal);

  assert.deepEqual(result.center, { lat: 51.5, lng: -0.12 });
  assert.equal(result.stations[0]?.name, "Central Charge");
  assert.equal(result.stations[0]?.connectors[0]?.powerKw, 150);
  assert.equal(new URL(requests[1]!).searchParams.get("distance"), "10");
});

test("search reports postcode lookup failures with a typed source", async () => {
  const fetcher: typeof fetch = async () => Response.json({ status: 404, result: null }, { status: 404 });
  const service = new ChargingStationService(config, fetcher);
  await assert.rejects(service.search("NOT A POSTCODE", 5, new AbortController().signal), (error: unknown) => error instanceof ChargingStationApiError && error.source === "postcode");
});
