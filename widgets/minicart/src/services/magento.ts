export async function fetchCartSummary(): Promise<number> {
    try {
        const res = await fetch(
            "/customer/section/load?sections=cart&force_new_section_timestamp=true",
            { credentials: "include" }
        );

        const data = await res.json();

        return data.cart?.summary_count ?? 0;
    } catch (err) {
        console.error("Failed to fetch section:", err);
        return 0;
    }
}
