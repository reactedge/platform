import { useTranslationState } from "../../../state/Translation/useTranslationState.ts";

interface ConnectorFilterProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export function ConnectorFilter({ value, onChange }: ConnectorFilterProps) {
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
