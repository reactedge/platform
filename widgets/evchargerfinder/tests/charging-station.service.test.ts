import assert from "node:assert/strict";
import { test } from "node:test";
import { ChargingStationService, ChargingStationServiceError } from "../src/domain/charging-station.service.ts";

const service = (fetcher: typeof fetch) => new ChargingStationService("https://reactedge.example", fetcher);

test("search issues the nearby request and validates the typed response", async () => {
  let requestedUrl = "";
  const fetcher: typeof fetch = async (input) => {
    requestedUrl = String(input);
    return Response.json({
      center: { lat: 51.5, lng: -0.12 },
      stations: [{ id: 7, name: "Central Charge", address: "1 High Street, London", lat: 51.51, lng: -0.11, connectors: [{ type: "CCS", powerKw: 150, quantity: 2 }], available: true, distanceKm: 1.2 }],
    });
  };
  const result = await service(fetcher).search("SW1A 1AA", 10, new AbortController().signal);

  assert.equal(new URL(requestedUrl).pathname, "/evchargers/nearby");
  assert.equal(new URL(requestedUrl).searchParams.get("postcode"), "SW1A 1AA");
  assert.equal(new URL(requestedUrl).searchParams.get("radiusKm"), "10");
  assert.equal(result.stations[0]?.connectors[0]?.powerKw, 150);
});

test("search reports backend postcode errors and rejects malformed response data", async () => {
  const badRequest: typeof fetch = async () => new Response(null, { status: 400 });
  await assert.rejects(service(badRequest).search("BAD", 5, new AbortController().signal), (error: unknown) => error instanceof ChargingStationServiceError && error.kind === "postcode");
  const malformed: typeof fetch = async () => Response.json({ center: { lat: 51, lng: 0 }, stations: [{ id: "wrong" }] });
  await assert.rejects(service(malformed).search("SW1A 1AA", 5, new AbortController().signal), (error: unknown) => error instanceof ChargingStationServiceError && error.kind === "response");
});

test("search converts fetch failures into a typed network error", async () => {
  const offline: typeof fetch = async () => { throw new Error("offline"); };
  await assert.rejects(service(offline).search("SW1A 1AA", 25, new AbortController().signal), (error: unknown) => error instanceof ChargingStationServiceError && error.kind === "network");
});

test("search times out and preserves caller cancellation", async () => {
  const waitForSignal: typeof fetch = async (_input, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
  });
  const timed = new ChargingStationService("https://reactedge.example", waitForSignal, 5);
  await assert.rejects(timed.search("SW1A 1AA", 50, new AbortController().signal), (error: unknown) => error instanceof ChargingStationServiceError && error.kind === "timeout");

  const controller = new AbortController();
  const cancelled = service(waitForSignal).search("SW1A 1AA", 5, controller.signal);
  controller.abort();
  await assert.rejects(cancelled, (error: unknown) => error instanceof DOMException && error.name === "AbortError");
});
