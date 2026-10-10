import {z} from 'zod';

const ErrorSchema = z.object({error: z.string()});

function serviceError(response: Response): Error | undefined {
    const isJson = response.headers.get('content-type')?.includes('application/json') === true;
    if (response.status === 404 && !isJson) return new Error('The listing service route is unavailable.');
    if ([502, 503, 504].includes(response.status)) return new Error('The listing service is unavailable.');
    if (response.status >= 500) {
        return new Error(isJson
            ? 'The listing service could not read or save its records.'
            : 'The listing service is unavailable.');
    }
    return undefined;
}

async function responseBody(response: Response): Promise<unknown> {
    try { return await response.json(); }
    catch { throw new Error('The listing service returned an invalid response.'); }
}

export async function requestListing(url: string, options: RequestInit): Promise<unknown> {
    let response: Response;
    try { response = await fetch(url, options); }
    catch { throw new Error('Cannot reach the listing service.'); }

    const error = serviceError(response);
    if (error) throw error;
    if (response.status === 204) return undefined;

    const body = await responseBody(response);
    if (!response.ok) {
        const parsed = ErrorSchema.safeParse(body);
        throw new Error(parsed.success ? parsed.data.error : 'The listing request failed.');
    }
    return body;
}
