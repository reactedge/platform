import fs from "fs/promises";

async function fetchContract(widget: string, contract: string) {
    const contractPath = `${process.env.WIDGETS_CONTRACT_PATH}/${widget}/${contract}`
    const parsed = JSON.parse(
        await fs.readFile(contractPath, 'utf8')
    );
    console.log(`SSR built with contract path: ${contractPath}`)

    return parsed;
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