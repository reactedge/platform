import type { FormEvent } from "react";
import type { RadiusKm } from "../../domain/charging-station.service.ts";
import { BASE_RADIUS_KM } from "../../domain/ev-charger.types.ts";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";

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
      <FilterPanel values={values} actions={actions} />
    </>
  );
}

function FilterPanel({ values, actions }: { readonly values: SearchValues; readonly actions: SearchActions }) {
  const { t } = useTranslationState();

  return (
    <fieldset className="evFinder__filters">
      <legend>{t("Filter charging points")}</legend>
      <ConnectorFilter value={values.connector} onChange={actions.onConnectorChange} />
      <SpeedFilter value={values.speed} onChange={actions.onSpeedChange} />
      <label className="evFinder__check">
        <input
          type="checkbox" checked={values.availableOnly}
          onChange={(event) => actions.onAvailabilityChange(event.target.checked)}
        />
        {t("Show operational stations only")}
      </label>
    </fieldset>
  );
}

function ConnectorFilter({ value, onChange }: { readonly value: string; readonly onChange: (value: string) => void }) {
  const { t } = useTranslationState();

  return (
    <label htmlFor="evFinder-connector">
      {t("Connector type")}
      <select id="evFinder-connector" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{t("All connectors")}</option>
        <option value="ccs">CCS</option>
        <option value="type 2">Type 2</option>
        <option value="chademo">CHAdeMO</option>
        <option value="type 1">Type 1</option>
      </select>
    </label>
  );
}

function SpeedFilter({ value, onChange }: { readonly value: string; readonly onChange: (value: string) => void }) {
  const { t } = useTranslationState();

  return (
    <label htmlFor="evFinder-speed">
      {t("Charging speed")}
      <select id="evFinder-speed" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{t("Any power")}</option>
        <option value="rapid">{t("Rapid · 50 kW+")}</option>
        <option value="standard">{t("Standard · under 50 kW")}</option>
      </select>
    </label>
  );
}
