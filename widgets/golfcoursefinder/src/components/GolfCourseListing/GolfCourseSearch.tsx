import { useState } from "react";
import { BASE_RADIUS_MI } from "../../domain/golf-course.types.ts";
import { getDistanceOptions } from "../../domain/golf-course-search.service.ts";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";

interface SearchFormProps {
    readonly onSearch: (postcode: string, radiusMiles: number) => void | Promise<void>;
}

export function GolfCourseSearchForm({ onSearch }: SearchFormProps) {
    const [postcode, setPostcode] = useState("");
    const [distance, setDistance] = useState<number>(BASE_RADIUS_MI[1]);
    const { t } = useTranslationState();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (postcode.trim()) void onSearch(postcode.trim(), distance);
    }

    return (
        <form className="golfCourseSearchForm" onSubmit={handleSubmit}>
            <label className="golfCourseSearchForm__label">
                <span>{t("UK postcode")}</span>
                <input
                    type="text"
                    placeholder={t("Enter postcode")}
                    value={postcode}
                    onChange={event => setPostcode(event.target.value)}
                    autoComplete="postal-code"
                    required
                    className="golfCourseSearchForm__input"
                />
            </label>
            <label className="golfCourseSearchForm__label">
                <span>{t("Search radius")}</span>
                <select
                    value={distance}
                    onChange={event => setDistance(Number(event.target.value))}
                    className="golfCourseSearchForm__select"
                >
                    {getDistanceOptions().map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit" className="golfCourseSearchForm__button">
                {t("Find golf courses")}
            </button>
        </form>
    );
}
