import { URL } from 'url';

export const normalizeUrl = (rawUrl: string) => {
    const url = new URL(rawUrl);

    // Normalize pathname by collapsing multiple slashes
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');

    // Also clean search parameters and hash if needed (optional)
    // url.search = decodeURIComponent(url.search);
    // url.hash = decodeURIComponent(url.hash);

    return url.toString();
}

export const sanitiseUrl = (rawUrl: string) => {
    const dummyHost = 'https://localurl.com'
    const url = new URL(`${dummyHost}${rawUrl}`);

    // Obscure each query parameter's value
    url.searchParams.forEach((value, key) => {
        url.searchParams.set(key, '***');
    });

    return `${url.pathname}${url.search}`
}