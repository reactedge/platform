import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { BASE_RADIUS_KM, type ChargingStation, type LatLng } from "../domain/ev-charger.types.ts";
import { filterStations } from "../domain/station-filters.ts";
import { ChargingStationApiError } from "../domain/charging-station.service.ts";
import type { WidgetConfig } from "../bootstrap/config/Config.ts";
import { useTranslationState } from "../state/Translation/useTranslationState.ts";
import { useSystemState } from "../state/System/useSystemState.ts";

type Props = { readonly config: WidgetConfig };

export function WidgetEVChargerFinder({ config }: Props) {
  const { t } = useTranslationState();
  const { chargingStationService } = useSystemState();
  const [postcode, setPostcode] = useState("");
  const [radius, setRadius] = useState<number>(10);
  const [connectorFilter, setConnectorFilter] = useState("all");
  const [speedFilter, setSpeedFilter] = useState("all");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [center, setCenter] = useState<LatLng>(config.data.defaultCenter);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => () => activeRequest.current?.abort(), []);

  const visibleStations = filterStations(stations, connectorFilter, speedFilter, availabilityOnly);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPostcode = postcode.trim();
    if (!trimmedPostcode) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    try {
      const result = await chargingStationService.search(trimmedPostcode, radius, controller.signal);
      if (!controller.signal.aborted) {
        setStations(result.stations);
        setCenter(result.center);
        setSelectedId(null);
      }
    } catch (cause) {
      if (!controller.signal.aborted) {
        setStations([]);
        setError(cause instanceof ChargingStationApiError && cause.source === "postcode" ? t("Enter a valid UK postcode.") : t("Charging stations could not be loaded. Please try again."));
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setLoading(false);
      }
    }
  }

  const bounds = visibleStations.reduce((box, station) => ({ minLat: Math.min(box.minLat, station.lat), maxLat: Math.max(box.maxLat, station.lat), minLng: Math.min(box.minLng, station.lng), maxLng: Math.max(box.maxLng, station.lng) }), { minLat: center.lat - 0.05, maxLat: center.lat + 0.05, minLng: center.lng - 0.08, maxLng: center.lng + 0.08 });
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.04);
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.04);

  return (
    <section className="evFinder" aria-labelledby="evFinder-heading">
      <header className="evFinder__header">
        <p className="evFinder__eyebrow">{t("UK electric vehicle charging")}</p>
        <h2 id="evFinder-heading">{t("Find a charger near you")}</h2>
        <p>{t("Search nearby charging points and check connector and power details.")}</p>
      </header>
      <form className="evFinder__search" onSubmit={handleSubmit}>
        <label htmlFor="evFinder-postcode">{t("UK postcode")}</label>
        <input id="evFinder-postcode" autoComplete="postal-code" value={postcode} onChange={(event) => setPostcode(event.target.value)} placeholder={t("e.g. SW1A 1AA")} required />
        <label htmlFor="evFinder-radius">{t("Search radius")}</label>
        <select id="evFinder-radius" value={radius} onChange={(event) => setRadius(Number(event.target.value))}>
          {BASE_RADIUS_KM.map((distance) => <option key={distance} value={distance}>{distance} km</option>)}
        </select>
        <button type="submit" disabled={loading}>{loading ? t("Searching…") : t("Search")}</button>
      </form>
      <fieldset className="evFinder__filters">
        <legend>{t("Filter charging points")}</legend>
        <label>{t("Connector type")}
          <select value={connectorFilter} onChange={(event) => setConnectorFilter(event.target.value)}>
            <option value="all">{t("All connectors")}</option><option value="ccs">CCS</option><option value="type 2">Type 2</option><option value="chademo">CHAdeMO</option><option value="type 1">Type 1</option>
          </select>
        </label>
        <label>{t("Charging speed")}
          <select value={speedFilter} onChange={(event) => setSpeedFilter(event.target.value)}>
            <option value="all">{t("Any power")}</option><option value="rapid">{t("Rapid · 50 kW+")}</option><option value="standard">{t("Standard · under 50 kW")}</option>
          </select>
        </label>
        <label className="evFinder__check"><input type="checkbox" checked={availabilityOnly} onChange={(event) => setAvailabilityOnly(event.target.checked)} />{t("Show operational stations only")}</label>
      </fieldset>
      {error && <p className="evFinder__message evFinder__message--error" role="alert">{error}</p>}
      {loading && <p className="evFinder__message" role="status" aria-live="polite">{t("Searching for nearby charging points…")}</p>}
      {!loading && hasSearched && !error && visibleStations.length === 0 && <p className="evFinder__message" role="status">{t("No charging points match your search. Try a wider radius or different filters.")}</p>}
      <section className="evFinder__results" aria-label={t("Search results")}>
        <section className="evFinder__map" aria-label={t("Interactive station map")}>
          <iframe className="evFinder__map-frame" title={t("Interactive OpenStreetMap showing the search area")} loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bounds.minLng - lngSpan * 0.08}%2C${bounds.minLat - latSpan * 0.08}%2C${bounds.maxLng + lngSpan * 0.08}%2C${bounds.maxLat + latSpan * 0.08}&layer=mapnik`} />
          <p className="evFinder__map-caption">{t("Select a map marker to view station details")}</p>
          <span className="evFinder__map-label" aria-hidden="true">{t("North")}</span>
          {visibleStations.map((station) => {
            const left = `${8 + ((station.lng - bounds.minLng) / lngSpan) * 82}%`;
            const top = `${8 + ((bounds.maxLat - station.lat) / latSpan) * 76}%`;
            return <button key={station.id} className={`evFinder__pin${selectedId === station.id ? " is-selected" : ""}`} style={{ left, top }} type="button" aria-label={t("Show %1 details", station.name)} aria-pressed={selectedId === station.id} onClick={() => setSelectedId(station.id)}>{station.available ? "⚡" : "•"}</button>;
          })}
          <a className="evFinder__map-link" href={`https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=13/${center.lat}/${center.lng}`} target="_blank" rel="noreferrer">{t("Open area in OpenStreetMap")}</a>
        </section>
        <section className="evFinder__list" aria-label={t("Charging station results")}>
          <h3>{hasSearched ? t("%1 stations found", visibleStations.length) : t("Search to see nearby stations")}</h3>
          {visibleStations.map((station) => <article key={station.id} className={`evFinder__station${selectedId === station.id ? " is-selected" : ""}`}>
            <button className="evFinder__station-title" type="button" aria-pressed={selectedId === station.id} onClick={() => setSelectedId(station.id)}>{station.name}</button>
            <p>{station.address || t("Address unavailable")}</p>
            <p className={station.available ? "evFinder__status" : "evFinder__status evFinder__status--offline"}>{station.available ? t("Operational") : t("Reported offline")}</p>
            <ul className="evFinder__connectors">{station.connectors.map((connector, index) => <li key={`${station.id}-${connector.type}-${index}`}>{connector.type} · {connector.powerKw === null ? t("Power unavailable") : `${connector.powerKw} kW`}{connector.quantity ? ` · ${connector.quantity} ${t("points")}` : ""}</li>)}</ul>
            <p className="evFinder__distance">{station.distanceKm.toFixed(1)} km {t("away")}</p>
          </article>)}
        </section>
      </section>
      <footer className="evFinder__attribution">{t("Station data provided by Open Charge Map. Operational status may not reflect live connector availability.")}</footer>
    </section>
  );
}
