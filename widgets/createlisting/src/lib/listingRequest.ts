import { z } from 'zod';

const ErrorSchema = z.object({ error: z.string() });

export async function requestListing(url: string, options: RequestInit): Promise<unknown> {
    let response: Response;
    try { response = await fetch(url, options); }
    catch { throw new Error('Cannot reach the listing service.'); }

    const json = response.headers.get('content-type')?.includes('application/json');
    if (response.status === 404 && !json) throw new Error('The listing service route is unavailable.');
    if ([502, 503, 504].includes(response.status)) throw new Error('The listing service is unavailable.');
    if (response.status >= 500) {
        throw new Error(json ? 'The listing service could not read or save its records.' : 'The listing service is unavailable.');
    }
    if (response.status === 204) return undefined;

    let body: unknown;
    try { body = await response.json(); }
    catch { throw new Error('The listing service returned an invalid response.'); }
    if (!response.ok) {
        const error = ErrorSchema.safeParse(body);
        throw new Error(error.success ? error.data.error : 'The listing request failed.');
    }
    return body;
}
