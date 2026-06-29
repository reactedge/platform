import {WIDGET_ID} from "../Config.ts";

const CDN_URL = 'https://widgets-cdn.co.uk'
export async function getCdnManifest() {
    const manifest = await fetch(`${CDN_URL}/${WIDGET_ID}/contracts/index.json`).then(r => r.json());

    const configs = await Promise.all(
        manifest.contracts.map(async (contract: string) => {

            const data = await fetch(`${CDN_URL}/${WIDGET_ID}/contracts/${contract}`).then(r => r.json());

            return {
                url: contract,
                id: contract.split('/').pop(),
                version: data.version || 'v1',
                data
            };
        })
    );

    return configs
}

export async function loadContract(name: string) {
    const data = await fetch(`/cdn/${name}`).then(r => r.json());
    return data;
}