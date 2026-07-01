
export function extractUrls(
    value: unknown
): string[] {

    const urls: string[] = [];

    if (typeof value === 'string') {

        if (
            value.startsWith('http://') ||
            value.startsWith('https://')
        ) {
            urls.push(value);
        }

        return urls;
    }

    if (Array.isArray(value)) {
        for (const item of value) {
            urls.push(
                ...extractUrls(item)
            );
        }

        return urls;
    }

    if (
        value &&
        typeof value === 'object'
    ) {
        for (const child of Object.values(value)) {
            urls.push(
                ...extractUrls(child)
            );
        }
    }

    return urls;
}