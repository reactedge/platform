import type { ChargingStation } from "../../domain/ev-charger.types.ts";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";

function StationCard({ station, selected, onSelect }: { readonly station: ChargingStation; readonly selected: boolean; readonly onSelect: (id: number) => void }) {
  const { t } = useTranslationState();
  return (
    <article className={`evFinder__station${selected ? " is-selected" : ""}`}>
      <button className="evFinder__station-title" type="button" aria-pressed={selected} onClick={() => onSelect(station.id)}>{station.name}</button>
      <p>{station.address || t("Address unavailable")}</p><p className={station.available ? "evFinder__status" : "evFinder__status evFinder__status--offline"}>{station.available ? t("Operational") : t("Reported offline")}</p>
      <ul className="evFinder__connectors">{station.connectors.map((connector, index) => <li key={`${station.id}-${connector.type}-${index}`}>{connector.type} · {connector.powerKw === null ? t("Power unavailable") : `${connector.powerKw} kW`}{connector.quantity ? ` · ${connector.quantity} ${t("points")}` : ""}</li>)}</ul>
      <p className="evFinder__distance">{station.distanceKm.toFixed(1)} km {t("away")}</p>
    </article>
  );
}

export function StationResults({ stations, selectedId, onSelect, hasSearched }: { readonly stations: readonly ChargingStation[]; readonly selectedId: number | null; readonly onSelect: (id: number) => void; readonly hasSearched: boolean }) {
  const { t } = useTranslationState();
  return (
    <section className="evFinder__list" aria-label={t("Charging station results")}>
      <h3>{hasSearched ? t("%1 stations found", stations.length) : t("Search to see nearby stations")}</h3>
      {stations.map((station) => <StationCard key={station.id} station={station} selected={selectedId === station.id} onSelect={onSelect} />)}
    </section>
  );
}
