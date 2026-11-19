import type { ChargingStation } from "../../domain/ev-charger.types.ts";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";
import { StationCard } from "./StationResults/StationCard.tsx";

interface StationResultsProps {
  readonly stations: readonly ChargingStation[];
  readonly selectedId: number | null;
  readonly onSelect: (id: number) => void;
  readonly hasSearched: boolean;
}

export function StationResults({ stations, selectedId, onSelect, hasSearched }: StationResultsProps) {
  const { t } = useTranslationState();
  return (
    <section className="evFinder__list" aria-label={t("Charging station results")}>
      <h3>{hasSearched ? t("%1 stations found", stations.length) : t("Search to see nearby stations")}</h3>
      {stations.map((station) => (
        <StationCard
          key={station.id} station={station} selected={selectedId === station.id} onSelect={onSelect}
        />
      ))}
    </section>
  );
}
