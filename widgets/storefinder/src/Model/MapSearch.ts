export class MapSearch {
    async geocodePostcode(
        postcode: string,
        countryCode: string
    ): Promise<{ lat: number; lng: number } | null> {
        const geocoder = new google.maps.Geocoder();

        return new Promise(resolve => {
            geocoder.geocode({ address: postcode, componentRestrictions: { country: countryCode } }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                    const loc = results[0]?.geometry.location;
                    if (loc === undefined)  resolve(null);
                    else {
                        resolve({ lat: loc.lat(), lng: loc.lng() });
                    }
                } else {
                    resolve(null);
                }
            });
        });
    }

    calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
