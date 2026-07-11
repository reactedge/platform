import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import { useMemo } from "react";
import type {LatLng, MapPolygon} from "../domain/regionmap.types.ts";
import {useSystemState} from "../state/System/useSystemState.ts";

interface RegionMapProps {
    title?: string;
    region: MapPolygon;
    center: LatLng;
    zoom: number;
}

export function RegionMap({ title, region, center, zoom }: RegionMapProps) {
    const { googleMapsApiKey } = useSystemState()

    const containerStyle = useMemo(
        () => ({
            width: "100%",
            height: "350px",
            borderRadius: "12px",
            overflow: "hidden"
        }),
        []
    );

    const polygonOptions = useMemo(
        () => ({
            strokeColor: "#7b1fa2",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#7b1fa2",
            fillOpacity: 0.25,
        }),
        []
    );

    return (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
            {title && <h3 data-regionmap-title>{title}</h3>}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={zoom}
                options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false
                }}
            >
                {region && region.length > 0 && (
                    <Polygon
                        path={region}
                        options={polygonOptions}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
}
