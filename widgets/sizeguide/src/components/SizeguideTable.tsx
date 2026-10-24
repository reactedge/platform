import type { WidgetConfig } from "../Config";

type Country = WidgetConfig["data"]["countries"][number];
type MeasurementUnit = WidgetConfig["settings"]["defaultUnit"];

type Props = {
    config: WidgetConfig;
    countryCode: string;
    selectedCountry: Country;
    unit: MeasurementUnit;
};

function displayMeasurement(value: number | undefined, sourceUnit: MeasurementUnit, targetUnit: MeasurementUnit) {
    if (value === undefined) return "—";
    const converted = sourceUnit === targetUnit ? value : sourceUnit === "cm" ? value / 2.54 : value * 2.54;
    return Number(converted.toFixed(1)).toString();
}

export const SizeguideTable = ({ config, countryCode, selectedCountry, unit }: Props) => (
    <div className="sizeguide__table-scroll">
        <table className="sizeguide__table">
            <caption className="sizeguide__visually-hidden">
                {config.data.title} for {selectedCountry.name}
            </caption>
            <thead>
                <tr>
                    <th scope="col">Size</th>
                    {config.data.sizes.map(size => <th scope="col" key={size.id}>{size.label}</th>)}
                </tr>
            </thead>
            <tbody>
                <tr className="sizeguide__country-sizes">
                    <th scope="row">{selectedCountry.name} size</th>
                    {config.data.sizes.map(size => (
                        <td key={size.id}>{size.labels[countryCode] ?? size.label}</td>
                    ))}
                </tr>
                {config.data.measurements.map((measurement, rowIndex) => (
                    <tr key={measurement.id} className={rowIndex % 2 ? "is-shaded" : ""}>
                        <th scope="row">{measurement.label} <span>({unit})</span></th>
                        {config.data.sizes.map(size => (
                            <td key={size.id}>
                                {displayMeasurement(measurement.values[size.id], measurement.unit, unit)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);