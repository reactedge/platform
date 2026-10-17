import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";
import type { GolfCourse, GolfCourseFinderConfig, LatLng } from "../../domain/golf-course.types.ts";
import { courseCoordinates, courseName } from "../../domain/golf-course-display.ts";
import { useTranslationState } from "../../state/Translation/useTranslationState.ts";

interface MapProps {
    readonly courses: readonly GolfCourse[];
    readonly currentCenter: LatLng;
    readonly config: GolfCourseFinderConfig;
}

export function GolfCourseMap({ courses, currentCenter, config }: MapProps) {
    const [selected, setSelected] = useState<GolfCourse | null>(null);
    const apiKey = config.integrations.googleMaps?.apiKey;
    const { t } = useTranslationState();
    if (!apiKey) return null;

    const coursesWithLocation = courses
        .map(course => ({ course, position: courseCoordinates(course) }))
        .filter((entry): entry is { course: GolfCourse; position: LatLng } => Boolean(entry.position));
    const selectedPosition = selected ? courseCoordinates(selected) : undefined;

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <div className="golfCourseMap">
                <div className="golfCourseMap__title">
                    {t("%1 golf courses found", courses.length)}
                </div>
                <GoogleMap
                    key={`${currentCenter.lat},${currentCenter.lng}`}
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    center={currentCenter}
                    zoom={config.data.zoom}
                >
                    {coursesWithLocation.map(({ course, position }, index) => (
                        <Marker
                            key={`${courseName(course)}-${index}`}
                            position={position}
                            onClick={() => setSelected(course)}
                        />
                    ))}
                    {selected && selectedPosition && (
                        <InfoWindow
                            position={selectedPosition}
                            onCloseClick={() => setSelected(null)}
                        >
                            <div><h4>{courseName(selected)}</h4></div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>
        </LoadScript>
    );
}
