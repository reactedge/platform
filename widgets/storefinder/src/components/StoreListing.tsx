import {StoreMap} from "./StoreListing/Map.tsx";
import {StoreSearchForm} from "./StoreListing/StoreSearch.tsx";
import React, {useMemo, useState} from "react";
import {MapSearch} from "../Model/MapSearch.ts";
import {StoreResultsCards} from "./StoreListing/StoreResultsCards.tsx";
import {StoreSearchService} from "../domain/storeSearch.service.ts";
import type {ResolvedStoreFinderConfig, StoreWithDistance} from "../domain/store.types.ts";
import {useTranslationState} from "../state/Translation/useTranslationState.ts";

type Props = {
    config: ResolvedStoreFinderConfig
}

export function StoreFinder({config}: Props) {
    const mapSearch = React.useMemo(() => new MapSearch(), []);
    const [listedStores, setListedStores] = useState(config.data.stores);
    const [currentCenter, setCurrentCenter] = useState(config.data.defaultCenter);
    const [error, setError] = useState<string | null>(null);
    const storeSearchService = useMemo(
        () => new StoreSearchService(config.data, mapSearch),
        [mapSearch]
    );
    const {t} = useTranslationState()

    const handleSearch = async (postcode: string, radius: number) => {
        const result = await storeSearchService.search(postcode, radius, config.data.country);

        if (!result) {
            setError(t("Postcode not found"));
            return;
        }

        setListedStores(result.stores);
        setCurrentCenter(result.center);
    }

    if (error) return <>{error}</>

    return (
        <>
            <StoreSearchForm onSearch={handleSearch} config={config} />
            <StoreMap stores={listedStores} currentCenter={currentCenter} config={config} />
            <StoreResultsCards stores={listedStores as StoreWithDistance[]} config={config} />
        </>
    );
};
