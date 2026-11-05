export interface SubscriptionSubmitDetail {
    purchaseType: "subscription";
    sku: string;
    storeCode: string;
    plan: {
        id: string;
        frequency: string;
        discount?: string;
        termsBlockId?: string;
    };
}

/**
 * Dispatches a storefront action for the selected subscription plan.
 * The host acknowledges synchronously with preventDefault() and owns
 * the asynchronous Magento operation.
 */
export function submitSubscriptionSelection(
    detail: SubscriptionSubmitDetail
): boolean {
    const event = new CustomEvent<SubscriptionSubmitDetail>(
        "reactedge:subscription:submit",
        { detail, cancelable: true }
    );

    return !window.dispatchEvent(event);
}
