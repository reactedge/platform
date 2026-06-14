import type {MinicartData} from "./Types.ts";
import {badgeStyle, buttonWrapper, openCartButtonStyle} from "./MinicartUI/minicartDrawerStyles";
import {__} from "../lib/i18n";
import {Loading} from "./Loading.tsx";
import type {ResolvedMinicartConfig} from "../hooks/useWidgetConfig.ts";

interface MinicartTriggerProps {
    cart: MinicartData | null;
    setIsOpen: (value: boolean) => void;
    config: ResolvedMinicartConfig
}

export function MinicartTrigger({ cart, setIsOpen, config }: MinicartTriggerProps) {
    const openCart = () => setIsOpen(true);
    const itemCount = cart?.summary_count ?? 0;

    if (!config.isReady) return <Loading config={config} />

    return (
        <div style={buttonWrapper}>
            <button style={{
                ...openCartButtonStyle,
                backgroundColor: config.primaryColor
            }} onClick={openCart}>
                {__('Cart')}
            </button>
            {itemCount > 0 && (
                <span style={{
                    ...badgeStyle,
                    backgroundColor: config.secondaryColour
                }}>{itemCount}</span>
            )}
        </div>
    );
}
