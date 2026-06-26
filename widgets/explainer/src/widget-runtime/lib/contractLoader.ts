export async function loadContractByName(name: string) {
    const res = await fetch(name);
    return res.json();
}