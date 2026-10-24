import { useState } from "react";
import type { WidgetConfig } from "../Config";
import { SizeguideHeader } from "./SizeguideHeader.tsx";
import { SizeguideHowTo } from "./SizeguideHowTo.tsx";
import { SizeguideTable } from "./SizeguideTable.tsx";

type Props = {
    config: WidgetConfig;
};

export const SizeguideContent = ({ config }: Props) => {
    const initialCountry = config.data.countries.some(
        country => country.code === config.data.defaultCountry,
    ) ? config.data.defaultCountry : config.data.countries[0]!.code;
    const [countryCode, setCountryCode] = useState(initialCountry);
    const [unit, setUnit] = useState(config.settings.defaultUnit);
    const selectedCountry = config.data.countries.find(
        country => country.code === countryCode,
    ) ?? config.data.countries[0]!;

    return (
        <section className="sizeguide" aria-labelledby="sizeguide-title">
            <SizeguideHeader
                config={config}
                countryCode={countryCode}
                setCountryCode={setCountryCode}
                unit={unit}
                setUnit={setUnit}
            />
            <SizeguideTable
                config={config}
                countryCode={countryCode}
                selectedCountry={selectedCountry}
                unit={unit}
            />
            <SizeguideHowTo config={config} />
        </section>
    );
};