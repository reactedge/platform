import type { ChargingStation } from "../../../domain/ev-charger.types.ts";
import { useTranslationState } from "../../../state/Translation/useTranslationState.ts";

interface StationCardProps {
  readonly station: ChargingStation;
  readonly selected: boolean;
  readonly onSelect: (id: number) => void;
}

export function StationCard({ station, selected, onSelect }: StationCardProps) {
  const { t } = useTranslationState();
  const statusClass = station.available ? "evFinder__status" : "evFinder__status evFinder__status--offline";

  return (
    <article className={`evFinder__station${selected ? " is-selected" : ""}`}>
      <button
        className="evFinder__station-title" type="button" aria-pressed={selected} onClick={() => onSelect(station.id)}
      >
        {station.name}
      </button>
      <p>{station.address || t("Address unavailable")}</p>
      <p className={statusClass}>{station.available ? t("Operational") : t("Reported offline")}</p>
      <ul className="evFinder__connectors">
        {station.connectors.map((connector, index) => (
          <li key={`${station.id}-${connector.type}-${index}`}>
            {connector.type} · {connector.powerKw === null ? t("Power unavailable") : `${connector.powerKw} kW`}
            {connector.quantity ? ` · ${connector.quantity} ${t("points")}` : ""}
          </li>
        ))}
      </ul>
      <p className="evFinder__distance">{station.distanceKm.toFixed(1)} km {t("away")}</p>
    </article>
  );
}
