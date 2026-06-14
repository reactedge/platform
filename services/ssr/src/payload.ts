async function fetchContract(widget: string, contract: string) {
    const contractPath = `${process.env.WIDGETS_CDN_URL}/${widget}/contracts/${contract}`
    const response = await fetch(contractPath);
    console.log(`SSR built with contract path: ${contractPath}`)

    if (!response.ok) {
        throw new Error(
            `Contract fetch failed: ${response.status}`
        );
    }

    return response.json();
}

export async function buildRenderPayload(
    body
) {
    const {
        widget,
        widgetId,
        contract,
        contractFile,
        runtimeConfig
    } = body;

    const resolvedContract =
        contract
        ?? await fetchContract(
            widget,
            contractFile
        );

    return {
        widget,
        widgetId,
        contract: resolvedContract,
        contractFile,
        runtimeConfig
    };
}