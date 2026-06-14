import type {ResolvedStoreFinderConfig, StoreWithDistance} from "../../domain/store.types.ts";
import {getUnitLabel} from "../../domain/storeSearch.service.ts";

interface StoreResultsCardsProps {
    readonly stores: readonly StoreWithDistance[];
    readonly config: ResolvedStoreFinderConfig
}

export function StoreResultsCards({ stores, config }: StoreResultsCardsProps) {
    if (stores.length === 0) {
        return (
            <p className="storeResults__empty">
                No stores found within the selected distance.
            </p>
        );
    }

    return (
        <div className="storeResults">
            {stores.map(store => (
                <div
                    key={`${store.lat},${store.lng}`}
                    className="storeCard"
                    data-store-card
                >
                    <div className="storeCard__header">
                        <h4 className="storeCard__title">{store.name}</h4>
                    </div>

                    <div className="storeCard__body">
                        <p className="storeCard__line">{store.hours}</p>
                        {typeof store.distance === "number" && Number.isFinite(store.distance) && (
                            <p className="storeCard__distance">
                                Distance: {store.distance.toFixed(1)} {getUnitLabel(config.data.country)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
