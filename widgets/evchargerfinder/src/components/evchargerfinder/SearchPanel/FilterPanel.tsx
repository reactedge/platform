import { useTranslationState } from "../../../state/Translation/useTranslationState.ts";
import { ConnectorFilter } from "./ConnectorFilter.tsx";
import { SpeedFilter } from "./SpeedFilter.tsx";

interface FilterPanelProps {
  readonly connector: string;
  readonly speed: string;
  readonly availableOnly: boolean;
  readonly onConnectorChange: (connector: string) => void;
  readonly onSpeedChange: (speed: string) => void;
  readonly onAvailabilityChange: (available: boolean) => void;
}

export function FilterPanel({
  connector, speed, availableOnly, onConnectorChange, onSpeedChange, onAvailabilityChange,
}: FilterPanelProps) {
  const { t } = useTranslationState();

  return (
    <fieldset className="evFinder__filters">
      <legend>{t("Filter charging points")}</legend>
      <ConnectorFilter value={connector} onChange={onConnectorChange} />
      <SpeedFilter value={speed} onChange={onSpeedChange} />
      <label className="evFinder__check">
        <input
          type="checkbox" checked={availableOnly}
          onChange={(event) => onAvailabilityChange(event.target.checked)}
        />
        {t("Show operational stations only")}
      </label>
    </fieldset>
  );
}
