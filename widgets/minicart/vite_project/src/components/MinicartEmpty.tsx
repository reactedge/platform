import {__} from "../lib/i18n.ts";

export function MinicartEmpty() {
    return (
        <p style={{ color: "#6b7280", marginTop: "16px" }}>
            {__('Your cart is empty.')}
        </p>
    );
}
