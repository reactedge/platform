import type { ChargingStation } from "../../../domain/ev-charger.types.ts";
import type { StationBounds } from "../../../domain/map-geometry.ts";
import { useTranslationState } from "../../../state/Translation/useTranslationState.ts";

interface StationPinProps {
  readonly station: ChargingStation;
  readonly bounds: StationBounds;
  readonly selected: boolean;
  readonly onSelect: (id: number) => void;
}

export function StationPin({ station, bounds, selected, onSelect }: StationPinProps) {
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.04);
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.04);
  const style = {
    left: `${8 + ((station.lng - bounds.minLng) / lngSpan) * 82}%`,
    top: `${8 + ((bounds.maxLat - station.lat) / latSpan) * 76}%`,
  };
  const { t } = useTranslationState();

  return (
    <button
      className={`evFinder__pin${selected ? " is-selected" : ""}`} style={style} type="button"
      aria-label={t("Show %1 details", station.name)} aria-pressed={selected} onClick={() => onSelect(station.id)}
    >
      {station.available ? "⚡" : "•"}
    </button>
  );
}
