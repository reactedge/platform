export function parseFiltersFromUrl(
    search: string,
    allowedAttributes: string[]
) {
    const params = new URLSearchParams(search);

    const result: Record<string, Record<string, number>> = {};

    params.forEach((value, key) => {
        if (!allowedAttributes.includes(key)) return;

        result[key] = {};

        value.split(',').forEach(v => {
            result[key][parseInt(v)] = 1;
        });
    });

    return result;
}