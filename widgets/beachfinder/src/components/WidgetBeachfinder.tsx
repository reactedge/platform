import { useEffect, useRef, useState, type FormEvent } from "react";
import type { WidgetConfig } from "../Config.ts";
import { BeachFinderApiError, type BeachSearchResponse } from "../services/beachfinder/BeachFinderApi.ts";
import { useSystemState } from "../state/System/useSystemState.ts";

type Props = { config: WidgetConfig };

type SearchOutputProps = {
    loading: boolean;
    error: string;
    results: BeachSearchResponse | null;
};

function SearchOutput({ loading, error, results }: SearchOutputProps) {
    if (loading) return <p className="beachfinder__notice">Searching for nearby beaches…</p>;
    if (error) return <p className="beachfinder__notice beachfinder__notice--error" role="alert">{error}</p>;
    if (!results) return null;
    if (results.beaches.length === 0) {
        return <p className="beachfinder__notice">No beaches found within {results.radiusMiles} miles of {results.postcode}.</p>;
    }
    return (
        <>
            <h3>Beaches near {results.postcode}</h3>
            <p className="beachfinder__summary">{results.beaches.length} found within {results.radiusMiles} miles</p>
            <ul className="beachfinder__list">
                {results.beaches.map((beach) => (
                    <li className="beachfinder__beach" key={beach.id}>
                        <div>
                            <h4>{beach.name || "Unnamed beach"}</h4>
                            <p>{beach.distanceMiles.toFixed(1)} miles away</p>
                        </div>
                        <a
                            href={`https://www.openstreetmap.org/?mlat=${beach.latitude}&mlon=${beach.longitude}#map=14/${beach.latitude}/${beach.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`View ${beach.name || "beach"} on OpenStreetMap`}
                        >Map</a>
                    </li>
                ))}
            </ul>
        </>
    );
}

export function WidgetBeachfinder({ config }: Props) {
    const { beachFinderApi } = useSystemState();
    const [postcode, setPostcode] = useState("");
    const [radiusMiles, setRadiusMiles] = useState(10);
    const [results, setResults] = useState<BeachSearchResponse | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const request = useRef<AbortController | null>(null);

    useEffect(() => () => request.current?.abort(), []);

    async function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setResults(null);
        setLoading(true);
        request.current?.abort();
        const controller = new AbortController();
        request.current = controller;
        try {
            const response = await beachFinderApi.search(postcode, radiusMiles, controller.signal);
            if (!controller.signal.aborted) setResults(response);
        } catch (cause) {
            if (controller.signal.aborted) return;
            setError(cause instanceof BeachFinderApiError
                ? cause.message
                : "Beach search is temporarily unavailable. Please try again.");
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }

    return (
        <section className="beachfinder" aria-labelledby="beachfinder-title">
            <header className="beachfinder__header">
                <p className="beachfinder__eyebrow">Find your coast</p>
                <h2 id="beachfinder-title" data-beachfinder-title>{config.data.title}</h2>
                {config.data.description && <p>{config.data.description}</p>}
            </header>
            <form className="beachfinder__form" onSubmit={submitSearch}>
                <label htmlFor="beachfinder-postcode">UK postcode</label>
                <input
                    id="beachfinder-postcode"
                    name="postcode"
                    autoComplete="postal-code"
                    required
                    maxLength={10}
                    placeholder="e.g. BN1 1AA"
                    value={postcode}
                    onChange={(event) => setPostcode(event.currentTarget.value)}
                />
                <label htmlFor="beachfinder-radius">Search radius</label>
                <div className="beachfinder__radius">
                    <input
                        id="beachfinder-radius"
                        name="radiusMiles"
                        type="number"
                        min="1"
                        max="100"
                        step="1"
                        required
                        value={radiusMiles}
                        onChange={(event) => setRadiusMiles(Number(event.currentTarget.value))}
                    />
                    <span>miles</span>
                </div>
                <button type="submit" disabled={loading || postcode.trim().length === 0 || radiusMiles < 1 || radiusMiles > 100}>
                    {loading ? "Searching…" : "Find beaches"}
                </button>
            </form>
            <div className="beachfinder__output" aria-live="polite" aria-busy={loading}>
                <SearchOutput loading={loading} error={error} results={results} />
            </div>
            <footer className="beachfinder__attribution">
                Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>
            </footer>
        </section>
    );
}
