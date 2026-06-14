import {useVenueTranslation} from "../../hooks/ui/useVenueTranslation.ts";

type FilterSectionProps = {
    title: string;
    isResolved: boolean;
    summary?: string;
    onEdit?: () => void;
    children: React.ReactNode;
};

export function FilterSection({
      title,
      isResolved,
      summary,
      onEdit,
      children,
  }: FilterSectionProps) {
    const t = useVenueTranslation();

    if (isResolved) {
        return (
            <div className="filter-summary">
                <strong>{t(title)}:</strong> {summary}
                <button
                    type="button"
                    className="filter-edit"
                    onClick={onEdit}
                    aria-label={`Edit ${title}`}
                >
                    ✎
                </button>
            </div>
        );
    }

    return (
        <section className="filter-group">
            <strong>{t(title)}</strong>
            {children}
        </section>
    );
}
