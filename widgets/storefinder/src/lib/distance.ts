type DistanceUnit = 'km' | 'mi';

export function getUnitForCountry(country: string): DistanceUnit {
    switch (country.toLowerCase()) {
        case 'uk':
        case 'gb':
            return 'mi';
        case 'fr':
        default:
            return 'km';
    }
}