import type { CSSProperties } from "react";
import type { WidgetConfig } from "../Config";

type Props = {
    config: WidgetConfig;
    countryCode: string;
    setCountryCode: (countryCode: string) => void;
    unit: WidgetConfig["settings"]["defaultUnit"];
    setUnit: (unit: WidgetConfig["settings"]["defaultUnit"]) => void;
};

export const SizeguideHeader = ({ config, countryCode, setCountryCode, unit, setUnit }: Props) => (
    <header className="sizeguide__header">
        <div>
            <p className="sizeguide__product-type">{config.data.productType}</p>
            <h1
                id="sizeguide-title"
                className="sizeguide__title"
                data-sizeguide-title
                style={{ color: config.settings.colour }}
            >
                {config.data.title}
            </h1>
            {config.data.description && (
                <p className="sizeguide__description">{config.data.description}</p>
            )}
        </div>
        <div className="sizeguide__controls">
            <label className="sizeguide__country-label" htmlFor="sizeguide-country">
                Country or region
            </label>
            <select
                id="sizeguide-country"
                className="sizeguide__country-select"
                value={countryCode}
                onChange={event => setCountryCode(event.target.value)}
                data-sizeguide-country
            >
                {config.data.countries.map(country => (
                    <option key={country.code} value={country.code}>
                        {country.flag ? `${country.flag} ` : ""}{country.name}
                    </option>
                ))}
            </select>
            <div className="sizeguide__unit-control" aria-label="Measurement units">
                <span className={unit === "cm" ? "is-selected" : ""}>cm</span>
                <button
                    className="sizeguide__unit-toggle"
                    type="button"
                    role="switch"
                    aria-checked={unit === "in"}
                    aria-label="Toggle inches and centimetres"
                    data-sizeguide-unit-toggle
                    onClick={() => setUnit(unit === "cm" ? "in" : "cm")}
                    style={{ "--sizeguide-accent": config.settings.accentColour } as CSSProperties}
                >
                    <span />
                </button>
                <span className={unit === "in" ? "is-selected" : ""}>in</span>
            </div>
        </div>
    </header>
);