export interface SubscriptionSubmitDetail {
    purchaseType: "one-time" | "subscription";
    sku: string;
    storeCode: string;
    plan?: {
        id: string;
        frequency: string;
        discount: string;
        termsUrl: string;
    };
}

/**
 * Dispatches the storefront action for a selected purchase option.
 * A storefront handler acknowledges the request synchronously with
 * event.preventDefault() and then performs its Magento integration.
 */
export function submitSubscriptionSelection(
    detail: SubscriptionSubmitDetail
): boolean {
    const event = new CustomEvent<SubscriptionSubmitDetail>(
        "reactedge:subscription:submit",
        {
            detail,
            cancelable: true,
        }
    );

    return !window.dispatchEvent(event);
}
