import {
    itemContainerStyle,
    itemListStyle,
    itemNameStyle,
    itemPriceStyle,
    itemQtyStyle, priceRowStyle
} from "./MinicartUI/minicartUIStyles.ts";
import {itemImageStyle, itemRowStyle} from "./MinicartUI/minicartStyles.ts";
import {formatPrice} from "../lib/price.ts";
import type {MinicartData} from "./Types.ts";
import {__} from "../lib/i18n.ts";
import {RemoveItemUI} from "./RemoveIcon.tsx";
import type {ResolvedMinicartConfig} from "../hooks/useWidgetConfig.ts";

interface MinicartListProps {
    cart: MinicartData | null;
    config: ResolvedMinicartConfig;
}

export function MinicartItemList({ cart, config }: MinicartListProps) {
    return (
        <div style={itemListStyle}>
            {cart?.items?.map(item => (
                <div key={item.item_id} style={itemRowStyle}>
                    <img
                        src={item.thumbnail.src}
                        alt={item.thumbnail.alt}
                        style={itemImageStyle}
                    />

                    <div style={itemContainerStyle}>
                        <p style={itemNameStyle}>{item.name}</p>

                        {item?.options && item?.options?.length > 0 && (
                            <div>
                                {item.options.map((opt, idx) => (
                                    <p
                                        key={idx}
                                        style={{
                                            fontSize: "13px",
                                            color: "#6b7280",
                                            margin: "2px 0"
                                        }}
                                    >
                                        {opt.label}: {opt.value}
                                    </p>
                                ))}
                            </div>
                        )}

                        <p style={itemQtyStyle}>{__('Qty')}: {item.qty}</p>

                        {/* PRICE + REMOVE BUTTON → same row */}
                        <div style={priceRowStyle}>
                            <p style={itemPriceStyle}>
                                {formatPrice(item.price, config.currency, config.locale)}
                            </p>
                            <RemoveItemUI item={item} config={config} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
