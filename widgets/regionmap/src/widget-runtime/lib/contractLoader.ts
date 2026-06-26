import {activity} from "../../activity";

export async function loadContract(hostElement: HTMLElement) {
    const contractUrl = hostElement.getAttribute("data-contract");

    if (!contractUrl) {
        throw new Error("Missing data-contract attribute");
    }

    const response = await fetch(contractUrl);

    if (!response.ok) {
        activity('bootstrap', 'Config error', {res: response});

        throw new Error(`Failed to load contract: ${response.status}`);
    }

    const json = await response.json();

    return json;
}