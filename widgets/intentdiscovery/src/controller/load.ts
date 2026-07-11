export function parseFiltersFromUrl(
    search: string,
    allowedAttributes: string[]
) {
    const params = new URLSearchParams(search);

    const result: Record<string, Record<string, number>> = {};

    params.forEach((value, key) => {
        if (!allowedAttributes.includes(key)) {
            return;
        }

        const values: Record<string, number> = {};

        value.split(',').forEach((v) => {
            values[parseInt(v, 10)] = 1;
        });

        result[key] = values;
    });

    return result;
}