import { z } from "zod";
import type { ChargingStation, LatLng } from "./ev-charger.types.ts";

const ConnectorSchema = z.object({ type: z.string(), powerKw: z.number().nullable(), quantity: z.number().int().nullable() }).strict();
const NearbyResponseSchema = z.object({
  center: z.object({ lat: z.number(), lng: z.number() }).strict(),
  stations: z.array(z.object({
    id: z.number().int(), name: z.string(), address: z.string(), lat: z.number(), lng: z.number(),
    connectors: z.array(ConnectorSchema), available: z.boolean(), distanceKm: z.number().nonnegative(),
  }).strict()),
}).strict();

export type RadiusKm = 5 | 10 | 25 | 50;
export interface NearbySearchResult { readonly center: LatLng; readonly stations: ChargingStation[] }
export type ChargingStationErrorKind = "postcode" | "network" | "service" | "response" | "timeout";

export class ChargingStationServiceError extends Error {
  readonly kind: ChargingStationErrorKind;

  constructor(kind: ChargingStationErrorKind) {
    super(kind);
    this.name = "ChargingStationServiceError";
    this.kind = kind;
  }
}

export class ChargingStationService {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;

  constructor(
    baseUrl: string,
    fetcher: typeof fetch = (...args) => globalThis.fetch(...args),
    timeoutMs = 12_000,
  ) {
    this.baseUrl = baseUrl;
    this.fetcher = fetcher;
    this.timeoutMs = timeoutMs;
  }

  async search(postcode: string, radiusKm: RadiusKm, signal: AbortSignal): Promise<NearbySearchResult> {
    const endpoint = new URL("/evchargers/nearby", this.baseUrl);
    endpoint.search = new URLSearchParams({ postcode: postcode.trim(), radiusKm: String(radiusKm) }).toString();
    const timeout = new AbortController();
    const onAbort = () => timeout.abort(signal.reason);
    signal.addEventListener("abort", onAbort, { once: true });
    const timer = setTimeout(() => timeout.abort("timeout"), this.timeoutMs);

    try {
      const response = await this.fetcher(endpoint, { signal: timeout.signal, headers: { Accept: "application/json" } });
      if (!response.ok) {
        if (response.status === 400 || response.status === 422) throw new ChargingStationServiceError("postcode");
        throw new ChargingStationServiceError("service");
      }
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        throw new ChargingStationServiceError("response");
      }
      const parsed = NearbyResponseSchema.safeParse(body);
      if (!parsed.success) throw new ChargingStationServiceError("response");
      return parsed.data;
    } catch (error) {
      if (signal.aborted) throw error;
      if (timeout.signal.aborted) throw new ChargingStationServiceError("timeout");
      if (error instanceof ChargingStationServiceError) throw error;
      throw new ChargingStationServiceError("network");
    } finally {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
    }
  }
}
