import type { GraphqlClient } from "@reactedge/framework/graphql/graphqlClient.ts";

export type DeliveryEstimateItem = {
    sku: string;
    quantity: number;
    selectedOptionUids?: string[];
    requiredOptionCount?: number;
};

export type DeliveryMethodEstimate = {
    carrierCode: string;
    methodCode: string;
    title: string;
    amount: number;
    currency: string;
};

type CreateGuestCartResponse = {
    createGuestCart?: {
        cart?: { id?: string | null } | null;
    } | null;
};

type AddProductsToCartResponse = {
    addProductsToCart?: {
        user_errors?: { message: string }[] | null;
    } | null;
};

type EstimateShippingMethodsResponse = {
    estimateShippingMethods?: {
        available: boolean;
        carrier_code: string;
        carrier_title: string;
        method_code: string;
        method_title: string;
        error_message?: string | null;
        amount?: { value: number; currency: string } | null;
        price_incl_tax?: { value: number; currency: string } | null;
    }[] | null;
};

const CREATE_GUEST_CART = `
    mutation CreateQuoteDeliveryCart {
        createGuestCart {
            cart {
                id
            }
        }
    }
`;

const ADD_PRODUCTS_TO_CART = `
    mutation AddQuoteProducts($cartId: String!, $cartItems: [CartItemInput!]!) {
        addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
            user_errors {
                message
            }
        }
    }
`;

const ESTIMATE_SHIPPING_METHODS = `
    mutation EstimateQuoteDelivery($input: EstimateTotalsInput!) {
        estimateShippingMethods(input: $input) {
            available
            carrier_code
            carrier_title
            method_code
            method_title
            error_message
            amount {
                value
                currency
            }
            price_incl_tax {
                value
                currency
            }
        }
    }
`;

export class MagentoDeliveryEstimator {
    private cartForItems: { signature: string; id: string } | null = null;

    constructor(private readonly graphqlClient: GraphqlClient) {}

    async estimate(
        items: DeliveryEstimateItem[],
        postcode: string,
        countryCode: string
    ): Promise<DeliveryMethodEstimate[]> {
        const normalizedPostcode = normalizePostcode(postcode);
        const normalizedCountryCode = countryCode.trim().toUpperCase();

        if (!items.length) throw new Error("Add a product to the quote before estimating delivery.");
        if (!normalizedPostcode) throw new Error("Enter a postcode to estimate delivery.");
        if (!/^[A-Z]{2}$/.test(normalizedCountryCode)) {
            throw new Error("A valid two-letter country code is required to estimate delivery.");
        }
        if (items.some(item => (item.requiredOptionCount ?? 0) > (item.selectedOptionUids?.length ?? 0))) {
            throw new Error("Choose all configurable product options before estimating delivery.");
        }

        const cartId = await this.getCartForItems(items);
        const response = await this.graphqlClient<EstimateShippingMethodsResponse>(
            ESTIMATE_SHIPPING_METHODS,
            {
                input: {
                    cart_id: cartId,
                    address: {
                        country_code: normalizedCountryCode,
                        postcode: normalizedPostcode,
                    },
                },
            },
            { cache: false }
        );

        if (!response?.estimateShippingMethods) {
            throw new Error("Magento did not return delivery methods for this postcode.");
        }

        return response.estimateShippingMethods
            .filter(method => method.available)
            .map(method => {
                const price = method.price_incl_tax ?? method.amount;
                if (!price) throw new Error("Magento returned a delivery method without a price.");

                return {
                    carrierCode: method.carrier_code,
                    methodCode: method.method_code,
                    title: method.method_title || method.carrier_title,
                    amount: price.value,
                    currency: price.currency,
                };
            });
    }

    private async getCartForItems(items: DeliveryEstimateItem[]): Promise<string> {
        const signature = getItemsSignature(items);
        if (this.cartForItems?.signature === signature) return this.cartForItems.id;

        const created = await this.graphqlClient<CreateGuestCartResponse>(
            CREATE_GUEST_CART,
            undefined,
            { cache: false }
        );
        const cartId = created?.createGuestCart?.cart?.id;
        if (!cartId) throw new Error("Magento did not create a delivery estimate cart.");

        const added = await this.graphqlClient<AddProductsToCartResponse>(
            ADD_PRODUCTS_TO_CART,
            {
                cartId,
                cartItems: items.map(item => ({
                    sku: item.sku,
                    quantity: item.quantity,
                    ...(item.selectedOptionUids?.length && {
                        selected_options: item.selectedOptionUids,
                    }),
                })),
            },
            { cache: false }
        );
        const addResult = added?.addProductsToCart;
        if (!addResult) throw new Error("Magento did not add the quote items to the delivery estimate cart.");

        const userErrors = addResult.user_errors ?? [];
        if (userErrors.length) {
            throw new Error(userErrors.map(error => error.message).join(" "));
        }

        this.cartForItems = { signature, id: cartId };
        return cartId;
    }
}

function normalizePostcode(postcode: string): string {
    return postcode.trim().replace(/\s+/g, " ").toUpperCase();
}

function getItemsSignature(items: DeliveryEstimateItem[]): string {
    const normalized = items.map(item => ({
        sku: item.sku.trim(),
        quantity: item.quantity,
        selectedOptionUids: [...(item.selectedOptionUids ?? [])].sort(),
    }));
    normalized.sort((left, right) => left.sku.localeCompare(right.sku));
    return JSON.stringify(normalized);
}
