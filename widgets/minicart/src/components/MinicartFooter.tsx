import { formatPrice } from "../lib/price";

import type {MinicartData} from "./Types.ts";
import {footerContainerStyle, footerRowStyle, checkoutButtonStyle} from "./MinicartUI/minicartFooterStyles.ts";
import {__} from "../lib/i18n.ts";
import type {ResolvedMinicartConfig} from "../hooks/useWidgetConfig.ts";

interface MinicartHeaderProps {
    cart: MinicartData | null;
    config: ResolvedMinicartConfig;
}

export function MinicartFooter({ cart, config }: MinicartHeaderProps) {
    if (!cart) return null;

    const subtotal =
        cart.items?.reduce((acc, item) => acc + item.price * item.qty, 0) ?? 0;

    return (
        <div style={footerContainerStyle}>
            {/* Top row */}
            <div style={footerRowStyle}>
                <label  style={{ fontSize: "18px", fontWeight: 600 }}>{__('Subtotal')}</label>
                <span>{formatPrice(subtotal, config.currency, config.locale)}</span>
            </div>

            {/* Checkout button */}
            <a href="/checkout" style={{
                ...checkoutButtonStyle,
                backgroundColor: config.primaryColor
            }}>
                {__('Proceed to Checkout')}
            </a>
        </div>
    );
}
