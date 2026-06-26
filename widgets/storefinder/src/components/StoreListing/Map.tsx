import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import type {LatLng, ResolvedStoreFinderConfig, Store} from "../../domain/store.types.ts";
import {useTranslationState} from "../../state/Translation/useTranslationState.ts";

interface StoreMapProps {
    readonly stores: readonly Store[];
    readonly currentCenter: LatLng;
    readonly config: ResolvedStoreFinderConfig
}

export function StoreMap({ stores, currentCenter, config }: StoreMapProps) {
    const [selected, setSelected] = useState<Store | null>(null);
    const apiKey = config.integrations.googleMaps?.apiKey
    const {t} = useTranslationState()

    if (apiKey === undefined) return null;

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <div className="storeMap">
                <div className="storeMap__title">
                    {stores.length <= 1
                        ? t('%1 store found', stores.length)
                        : t('%1 stores found', stores.length)}
                </div>

                <GoogleMap
                    key={stores.length}
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    center={currentCenter}
                    zoom={config.data.zoom}
                >
                    {stores.map(store => (
                        <Marker
                            key={`${store.lat},${store.lng}`}
                            position={{ lat: store.lat, lng: store.lng }}
                            onClick={() => setSelected(store)}
                        />
                    ))}

                    {selected && (
                        <InfoWindow
                            position={{ lat: selected.lat, lng: selected.lng }}
                            onCloseClick={() => setSelected(null)}
                        >
                            <div>
                                <h4>{selected.name}</h4>
                                <p>{selected.hours}</p>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </LoadScript>
    );
}
