export async function getCdnManifest() {
    const manifest = await fetch(`/cdn/index.json`).then(r => r.json());

    const configs = await Promise.all(
        manifest.contracts.map(async (contract: string) => {

            const data = await fetch(`/cdn/${contract}`).then(r => r.json());

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