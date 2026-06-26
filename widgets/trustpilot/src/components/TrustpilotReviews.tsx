import { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import {useSystemState} from "../state/System/useSystemState.ts";
import type {ResolvedTrustpilotConfig} from "../domain/trustpilot.types.ts";
import {activity} from "../activity";

type Review = {
    author: string;
    rating: number;
    text: string;
};

type PlacesData = {
    name: string;
    rating: number;
    totalReviews: number;
    reviews: Review[];
};

type Props = {
    config: ResolvedTrustpilotConfig
}

export const TrustpilotReviews = ({ config }: Props) => {
    const [data, setData] = useState<PlacesData | null>(null);
    const { googleMapsApiKey } = useSystemState()
    const [mapsLoaded, setMapsLoaded] = useState(false)

    const placeId = config.integrations.googleMaps?.placeId || ''

    const renderStars = (rating: number) => {
        return (
            <span style={{ color: "#f5a623" }}>
      {"★".repeat(Math.round(rating))}
    </span>
        );
    };

    const truncate = (text: string, max = 180) =>
        text.length > max ? text.slice(0, max) + "..." : text;

    useEffect(() => {
        if (!mapsLoaded) return;
        if (!window.google?.maps?.places) return;
        if (!window.google) return;

        const div = document.createElement("div");
        document.body.appendChild(div);

        const service = new window.google.maps.places.PlacesService(div);

        service.getDetails(
            {
                placeId,
                fields: ["name", "rating", "user_ratings_total", "reviews"],
            },
            (result: any, status: any) => {
                activity('trustpilot-reviews', 'Trustpilot review', result);
                if (status === "OK" && result) {
                    setData({
                        name: result.name,
                        rating: result.rating,
                        totalReviews: result.user_ratings_total,
                        reviews: (result.reviews || []).map((r: any) => ({
                            author: r.author_name,
                            rating: r.rating,
                            text: r.text,
                        })),
                    });
                }
            }
        );
    }, [placeId, mapsLoaded]);

    return (
        <LoadScript
            googleMapsApiKey={googleMapsApiKey}
            libraries={["places"]}
            onLoad={() => setMapsLoaded(true)}
        >
            <div className="re-widget-reviews">
                {config.data.title && <h3>{config.data.title}</h3>}

                {data && (
                    <>
                        <div className="re-widget-reviews__header">
                            <div className="re-widget-reviews__title">
                                {data.name}
                            </div>

                            <div className="re-widget-reviews__rating">
                              <span className="re-widget-reviews__stars">
                                {"★".repeat(Math.round(data.rating))}
                              </span>
                                <span>
                                {data.rating} ({data.totalReviews} reviews)
                              </span>
                            </div>
                        </div>

                        <div className="re-widget-reviews__list">
                        {data.reviews.slice(0, 3).map((r, i) => (
                            <div key={i} className="re-widget-reviews__card">
                                <div className="re-widget-reviews__author">
                                    {r.author}
                                </div>

                                <div className="re-widget-reviews__stars">
                                    {renderStars(r.rating)}
                                </div>

                                <p className="re-widget-reviews__text">
                                    {truncate(r.text)}
                                </p>
                            </div>
                        ))}
                        </div>
                    </>
                )}
            </div>
        </LoadScript>
    );
};