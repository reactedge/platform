import type { ChargingStation, LatLng } from "../../domain/ev-charger.types.ts";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";

interface Bounds { readonly minLat: number; readonly maxLat: number; readonly minLng: number; readonly maxLng: number }
interface MapProps { readonly center: LatLng; readonly stations: readonly ChargingStation[]; readonly bounds: Bounds; readonly selectedId: number | null; readonly onSelect: (id: number) => void }

function StationPin({ station, bounds, selected, onSelect }: { readonly station: ChargingStation; readonly bounds: Bounds; readonly selected: boolean; readonly onSelect: (id: number) => void }) {
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.04);
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.04);
  const style = { left: `${8 + ((station.lng - bounds.minLng) / lngSpan) * 82}%`, top: `${8 + ((bounds.maxLat - station.lat) / latSpan) * 76}%` };
  const { t } = useTranslationState();
  return <button className={`evFinder__pin${selected ? " is-selected" : ""}`} style={style} type="button" aria-label={t("Show %1 details", station.name)} aria-pressed={selected} onClick={() => onSelect(station.id)}>{station.available ? "⚡" : "•"}</button>;
}

export function StationMap({ center, stations, bounds, selectedId, onSelect }: MapProps) {
  const { t } = useTranslationState();
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.04);
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.04);
  const bbox = `${bounds.minLng - lngSpan * 0.08}%2C${bounds.minLat - latSpan * 0.08}%2C${bounds.maxLng + lngSpan * 0.08}%2C${bounds.maxLat + latSpan * 0.08}`;
  return (
    <section className="evFinder__map" aria-label={t("Interactive station map")}>
      <iframe className="evFinder__map-frame" title={t("Interactive OpenStreetMap showing the search area")} loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`} />
      <p className="evFinder__map-caption">{t("Select a map marker to view station details")}</p><span className="evFinder__map-label" aria-hidden="true">{t("North")}</span>
      {stations.map((station) => <StationPin key={station.id} station={station} bounds={bounds} selected={selectedId === station.id} onSelect={onSelect} />)}
      <a className="evFinder__map-link" href={`https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=13/${center.lat}/${center.lng}`} target="_blank" rel="noreferrer">{t("Open area in OpenStreetMap")}</a>
    </section>
  );
}
