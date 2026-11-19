import type { FormEvent } from "react";
import type { RadiusKm } from "../../domain/charging-station.service.ts";
import { BASE_RADIUS_KM } from "../../domain/ev-charger.types.ts";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";
import { FilterPanel } from "./SearchPanel/FilterPanel.tsx";

interface SearchValues {
  readonly postcode: string;
  readonly radius: RadiusKm;
  readonly connector: string;
  readonly speed: string;
  readonly availableOnly: boolean;
}

interface SearchActions {
  readonly onPostcodeChange: (postcode: string) => void;
  readonly onRadiusChange: (radius: RadiusKm) => void;
  readonly onConnectorChange: (connector: string) => void;
  readonly onSpeedChange: (speed: string) => void;
  readonly onAvailabilityChange: (available: boolean) => void;
  readonly onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface SearchPanelProps {
  readonly values: SearchValues;
  readonly actions: SearchActions;
  readonly loading: boolean;
}

export function SearchPanel({ values, actions, loading }: SearchPanelProps) {
  const { t } = useTranslationState();

  return (
    <>
      <form className="evFinder__search" onSubmit={actions.onSubmit}>
        <label htmlFor="evFinder-postcode">{t("UK postcode")}</label>
        <input
          id="evFinder-postcode" autoComplete="postal-code" value={values.postcode}
          onChange={(event) => actions.onPostcodeChange(event.target.value)}
          placeholder={t("e.g. SW1A 1AA")} required
        />
        <label htmlFor="evFinder-radius">{t("Search radius")}</label>
        <select
          id="evFinder-radius" value={values.radius}
          onChange={(event) => actions.onRadiusChange(Number(event.target.value) as RadiusKm)}
        >
          {BASE_RADIUS_KM.map((distance) => (
            <option key={distance} value={distance}>{distance} km</option>
          ))}
        </select>
        <button type="submit" disabled={loading}>{loading ? t("Searching…") : t("Search")}</button>
      </form>
      <FilterPanel
        connector={values.connector}
        speed={values.speed}
        availableOnly={values.availableOnly}
        onConnectorChange={actions.onConnectorChange}
        onSpeedChange={actions.onSpeedChange}
        onAvailabilityChange={actions.onAvailabilityChange}
      />
    </>
  );
}
