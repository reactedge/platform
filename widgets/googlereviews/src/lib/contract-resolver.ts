export async function loadContract(name: string) {
    const data = await fetch(`/${name}`).then(r => r.json());
    return data;
}