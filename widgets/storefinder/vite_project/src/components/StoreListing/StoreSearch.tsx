import { useState } from "react";
import {BASE_RADIUS_KM, type ResolvedStoreFinderConfig} from "../../domain/store.types";
import {getDistanceOptions} from "../../domain/storeSearch.service.ts";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";

interface SearchFormProps {
    readonly onSearch: (postcode: string, distanceMiles: number) => void;
    readonly config: ResolvedStoreFinderConfig
}

export function StoreSearchForm({ onSearch, config }: SearchFormProps) {
    const [postcode, setPostcode] = useState("");
    const [distance, setDistance] = useState(BASE_RADIUS_KM[0]);
    const {t} = useTranslationState();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!postcode.trim()) return;
        onSearch(postcode.trim(), distance);
    }

    return (
        <form className="storeSearchForm" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder={t("Enter postcode")}
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                required
                className="storeSearchForm__input"
            />

            <select
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="storeSearchForm__select"
            >
                {getDistanceOptions(config.data.country).map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <button type="submit" className="storeSearchForm__button">
                {t("Search")}
            </button>
        </form>
    );
}
