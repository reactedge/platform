import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { ChargingStation, LatLng } from "../domain/ev-charger.types.ts";
import { ChargingStationServiceError, type ChargingStationErrorKind, type RadiusKm } from "../domain/charging-station.service.ts";
import { filterStations } from "../domain/station-filters.ts";
import { getStationBounds } from "../domain/map-geometry.ts";
import type { WidgetConfig } from "../bootstrap/config/Config.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";
import { useSystemState } from "../state/System/useSystemState.ts";
import { SearchPanel } from "./evchargerfinder/SearchPanel.tsx";
import { SearchFeedback } from "./evchargerfinder/SearchFeedback.tsx";
import { StationMap } from "./evchargerfinder/StationMap.tsx";
import { StationResults } from "./evchargerfinder/StationResults.tsx";

type Props = { readonly config: WidgetConfig };

export function WidgetEVChargerFinder({ config }: Props) {
  const { t } = useTranslationState();
  const { chargingStationService } = useSystemState();
  const [postcode, setPostcode] = useState("");
  const [radius, setRadius] = useState<RadiusKm>(10);
  const [connectorFilter, setConnectorFilter] = useState("all");
  const [speedFilter, setSpeedFilter] = useState("all");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [center, setCenter] = useState<LatLng>(config.data.defaultCenter);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<ChargingStationErrorKind | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const visibleStations = filterStations(stations, connectorFilter, speedFilter, availabilityOnly);
  const bounds = getStationBounds(visibleStations, center);

  useEffect(() => () => activeRequest.current?.abort(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!postcode.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    activeRequest.current?.abort();
    const request = new AbortController();
    activeRequest.current = request;
    try {
      const result = await chargingStationService.search(postcode, radius, request.signal);
      if (!request.signal.aborted) { setStations(result.stations); setCenter(result.center); setSelectedId(null); }
    } catch (cause) {
      if (!request.signal.aborted) {
        setStations([]);
        setError(cause instanceof ChargingStationServiceError ? cause.kind : "service");
      }
    } finally {
      if (activeRequest.current === request) { activeRequest.current = null; setLoading(false); }
    }
  }

  const searchValues = { postcode, radius, connector: connectorFilter, speed: speedFilter, availableOnly: availabilityOnly };
  const searchActions = {
    onPostcodeChange: setPostcode, onRadiusChange: setRadius, onConnectorChange: setConnectorFilter,
    onSpeedChange: setSpeedFilter, onAvailabilityChange: setAvailabilityOnly, onSubmit: handleSubmit,
  };

  return (
    <section className="evFinder" aria-labelledby="evFinder-heading">
      <header className="evFinder__header">
        <p className="evFinder__eyebrow">{t("UK electric vehicle charging")}</p>
        <h2 id="evFinder-heading">{t("Find a charger near you")}</h2>
        <p>{t("Search nearby charging points and check connector and power details.")}</p>
      </header>
      <SearchPanel values={searchValues} actions={searchActions} loading={loading} />
      <SearchFeedback loading={loading} hasSearched={hasSearched} hasResults={visibleStations.length > 0} error={error} />
      <section className="evFinder__results" aria-label={t("Search results")}>
        <StationMap center={center} stations={visibleStations} bounds={bounds} selectedId={selectedId} onSelect={setSelectedId} />
        <StationResults stations={visibleStations} selectedId={selectedId} onSelect={setSelectedId} hasSearched={hasSearched} />
      </section>
      <footer className="evFinder__attribution">
        {t("Station data provided by ReactEdge charging service. Operational status may not reflect live connector availability.")}
      </footer>
    </section>
  );
}
