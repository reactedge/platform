import type {MinicartData} from "../components/Types.ts";

export async function loadMagentoCart(): Promise<MinicartData> {
    const res = await fetch(
        "/customer/section/load?sections=cart&force_new_section_timestamp=true",
        { credentials: "include" }
    );

    const data = await res.json();
    const section = data.cart;

    if (!section) {
        return { summary_count: 0, items: [] };
    }

    return {
        summary_count: section.summary_count ?? 0,
        items: section.items.map((item: any) => ({
            item_id: item.item_id,
            sku: item.sku,
            name: item.product_name,
            qty: item.qty,
            price: item.product_price_value,
            thumbnail: item.product_image,
            options: Array.isArray(item.options)
                ? item.options.map((opt: any) => ({
                    label: opt.label,
                    value: opt.value
                }))
                : []
        }))
    };
}

export async function removeItem(itemId: number, maskCartId: string) {
    document.dispatchEvent(new CustomEvent("widget:removeItem", {
        detail: { itemId, cartId: maskCartId },
        bubbles: true,
        composed: true
    }));
}

export async function fetchWidgetContext(baseUrl = '') {
    const resp = await fetch(`${baseUrl}/rest/V1/widgetbridge/context`);
    return await resp.json();
}
