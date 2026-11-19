import { useTranslationState } from "../../state/Translation/useTranslationState.ts";
import type { ChargingStationErrorKind } from "../../domain/charging-station.service.ts";

interface SearchFeedbackProps {
  readonly loading: boolean;
  readonly hasSearched: boolean;
  readonly hasResults: boolean;
  readonly error: ChargingStationErrorKind | null;
}

export function SearchFeedback({ loading, hasSearched, hasResults, error }: SearchFeedbackProps) {
  const { t } = useTranslationState();
  if (loading) return (
    <p className="evFinder__message" role="status" aria-live="polite">{t("Searching for nearby charging points…")}</p>
  );
  if (error === "postcode") return (
    <p className="evFinder__message evFinder__message--error" role="alert">{t("Enter a valid UK postcode.")}</p>
  );
  if (error) return (
    <p className="evFinder__message evFinder__message--error" role="alert">
      {t("Charging stations could not be loaded. Please try again.")}
    </p>
  );
  if (hasSearched && !hasResults) return (
    <p className="evFinder__message" role="status">
      {t("No charging points match your search. Try a wider radius or different filters.")}
    </p>
  );
  return null;
}
