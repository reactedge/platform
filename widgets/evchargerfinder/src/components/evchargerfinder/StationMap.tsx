import type { ChargingStation, LatLng } from "../../domain/ev-charger.types.ts";
import type { StationBounds } from "../../domain/map-geometry.ts";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";
import { StationPin } from "./StationMap/StationPin.tsx";

interface MapProps {
  readonly center: LatLng;
  readonly stations: readonly ChargingStation[];
  readonly bounds: StationBounds;
  readonly selectedId: number | null;
  readonly onSelect: (id: number) => void;
}

export function StationMap({ center, stations, bounds, selectedId, onSelect }: MapProps) {
  const { t } = useTranslationState();
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.04);
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.04);
  const bbox = [
    bounds.minLng - lngSpan * 0.08,
    bounds.minLat - latSpan * 0.08,
    bounds.maxLng + lngSpan * 0.08,
    bounds.maxLat + latSpan * 0.08,
  ].join("%2C");
  return (
    <section className="evFinder__map" aria-label={t("Interactive station map")}>
      <iframe
        className="evFinder__map-frame" title={t("Interactive OpenStreetMap showing the search area")}
        loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`}
      />
      <p className="evFinder__map-caption">{t("Select a map marker to view station details")}</p>
      <span className="evFinder__map-label" aria-hidden="true">{t("North")}</span>
      {stations.map((station) => (
        <StationPin
          key={station.id} station={station} bounds={bounds}
          selected={selectedId === station.id} onSelect={onSelect}
        />
      ))}
      <a
        className="evFinder__map-link" target="_blank" rel="noreferrer"
        href={`https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=13/${center.lat}/${center.lng}`}
      >
        {t("Open area in OpenStreetMap")}
      </a>
    </section>
  );
}
