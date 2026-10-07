import {createHash} from 'node:crypto';

type Params = Record<string, string | number>;

export const createCloudinarySignature = (params: Params, apiSecret: string): string => {
    const payload = Object.entries(params)
        .filter(([, value]) => value !== '')
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    return createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
};
