import {
    headerContainerStyle,
    headerRowStyle
} from "./MinicartUI/minicartHeaderStyles";
import type {MinicartData} from "./Types.ts";
import {__, __n} from "../lib/i18n.ts";
import {closeButtonStyle, headerStyle} from "./MinicartUI/minicartStyles.ts";

interface MinicartHeaderProps {
    cart: MinicartData | null;
    closeCart: () => void
}

export function MinicartHeader({ cart, closeCart }: MinicartHeaderProps) {
    if (!cart) return null;

    const itemCount = cart.summary_count ?? 0;

    return (
        <div style={headerContainerStyle}>
            <div style={headerStyle}>
                <h2>{__('Your Cart')}</h2>
                <button style={closeButtonStyle} onClick={closeCart}>✕</button>
            </div>

            {/* Top row */}
            {itemCount > 0 && (
            <div style={headerRowStyle}>
                <span>
                  {itemCount === 1
                      ? __("1 item in cart")
                      : __n("%1 items in cart", itemCount)}
                </span>
            </div>)}
        </div>
    );
}
