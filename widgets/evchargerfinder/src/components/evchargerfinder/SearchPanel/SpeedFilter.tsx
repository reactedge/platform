import { useTranslationState } from "../../../state/Translation/useTranslationState.ts";

interface SpeedFilterProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function SpeedFilter({ value, onChange }: SpeedFilterProps) {
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
