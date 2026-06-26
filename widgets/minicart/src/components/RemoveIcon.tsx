import {
    removeButtonStyle
} from "./MinicartUI/minicartUIStyles.ts";
import {removeItem} from "../services/magentoCartService.ts";

export const BinIcon = ({ size = 18, color = "#6b7280" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3 6H21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M8 6V4C8 3.447 8.447 3 9 3H15C15.553 3 16 3.447 16 4V6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M19 6L18.2 19.2C18.134 20.255 17.255 21 16.2 21H7.8C6.745 21 5.866 20.255 5.8 19.2L5 6"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M10 11V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M14 11V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export function RemoveItemUI({item, config}: any) {

    return (
        <button
            style={removeButtonStyle}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            onClick={() => removeItem(item.item_id, config.maskedCartId || '')}
        >
            <BinIcon size={18} color="#444"/>
        </button>

    );
}
