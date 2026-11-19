import type { EVChargerFinderConfig, ChargingStation, LatLng } from "./ev-charger.types.ts";

type ApiPoi = {
  ID: number;
  AddressInfo?: { Title?: string; AddressLine1?: string; Town?: string; Postcode?: string; Latitude?: number; Longitude?: number; Distance?: number };
  Connections?: Array<{ ConnectionType?: { Title?: string }; PowerKW?: number; Quantity?: number }>;
  StatusType?: { IsOperational?: boolean };
};

export class ChargingStationApiError extends Error {
  readonly source: "postcode" | "stations";

  constructor(source: "postcode" | "stations") {
    super(source === "postcode" ? "postcode" : "stations");
    this.source = source;
  }
}

function toStation(item: ApiPoi): ChargingStation | null {
  const address = item.AddressInfo;
  if (!address || typeof address.Latitude !== "number" || typeof address.Longitude !== "number") return null;
  return {
    id: item.ID,
    name: address.Title ?? "Charging station",
    address: [address.AddressLine1, address.Town, address.Postcode].filter(Boolean).join(", "),
    lat: address.Latitude,
    lng: address.Longitude,
    connectors: (item.Connections ?? []).map((connection) => ({
      type: connection.ConnectionType?.Title ?? "Unknown connector",
      powerKw: typeof connection.PowerKW === "number" ? connection.PowerKW : null,
      quantity: typeof connection.Quantity === "number" ? connection.Quantity : null,
    })),
    available: item.StatusType?.IsOperational !== false,
    distanceKm: typeof address.Distance === "number" ? address.Distance : 0,
  };
}

export class ChargingStationService {
  private readonly config: EVChargerFinderConfig;
  private readonly fetcher: typeof fetch;

  constructor(config: EVChargerFinderConfig, fetcher: typeof fetch = (...args) => globalThis.fetch(...args)) {
    this.config = config;
    this.fetcher = fetcher;
  }

  async search(postcode: string, radiusKm: number, signal: AbortSignal): Promise<{ center: LatLng; stations: ChargingStation[] }> {
    const center = await this.locatePostcode(postcode, signal);
    const stations = await this.findStations(center, radiusKm, signal);
    return { center, stations };
  }

  private async locatePostcode(postcode: string, signal: AbortSignal): Promise<LatLng> {
    const code = encodeURIComponent(postcode.replace(/\s+/g, "").toUpperCase());
    let response: Response;
    try {
      response = await this.fetcher(`${this.config.integrations.ukPostcodesApi.api}${code}`, { signal, headers: { Accept: "application/json" } });
    } catch {
      throw new ChargingStationApiError("postcode");
    }
    if (!response.ok) throw new ChargingStationApiError("postcode");
    const payload = await response.json() as { status?: number; result?: { latitude?: number; longitude?: number } };
    const result = payload.result;
    if (payload.status !== 200 || typeof result?.latitude !== "number" || typeof result.longitude !== "number") throw new ChargingStationApiError("postcode");
    return { lat: result.latitude, lng: result.longitude };
  }

  private async findStations(center: LatLng, radiusKm: number, signal: AbortSignal): Promise<ChargingStation[]> {
    const query = new URLSearchParams({ latitude: String(center.lat), longitude: String(center.lng), distance: String(radiusKm), distanceunit: "KM", maxresults: "100", compact: "true", verbose: "false" });
    const apiKey = this.config.integrations.openChargeMapApi.apiKey;
    if (apiKey) query.set("key", apiKey);
    const endpoint = new URL(this.config.integrations.openChargeMapApi.api);
    endpoint.search = query.toString();
    let response: Response;
    try {
      response = await this.fetcher(endpoint.toString(), { signal, headers: { Accept: "application/json" } });
    } catch {
      throw new ChargingStationApiError("stations");
    }
    if (!response.ok) throw new ChargingStationApiError("stations");
    const payload = await response.json() as ApiPoi[];
    return payload.map(toStation).filter((station): station is ChargingStation => station !== null);
  }
}
