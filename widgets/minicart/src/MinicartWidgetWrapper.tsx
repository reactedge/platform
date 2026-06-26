import {useWidgetConfig} from "./hooks/useWidgetConfig.ts";
import {useState} from "react";
import {useMagentoCart} from "./hooks/useMagentoCart.ts";
import {MinicartTrigger} from "./components/MinicartTrigger.tsx";
import {
    backdropStyle,
    drawerBaseStyle,
    drawerClosedStyle,
    drawerOpenStyle
} from "./components/MinicartUI/minicartStyles.ts";
import {MinicartHeader} from "./components/MinicartHeader.tsx";
import {contentStyle, footerStyle} from "./components/MinicartUI/minicartDrawerStyles.ts";
import {MinicartEmpty} from "./components/MinicartEmpty.tsx";
import {MinicartItemList} from "./components/MinicartItemList.tsx";
import {MinicartFooter} from "./components/MinicartFooter.tsx";
import {Spinner} from "./components/global/Spinner.tsx";
import {ErrorState} from "./components/global/ErrorState.tsx";

type Props = {
    host: HTMLElement;
};

export const MinicartWidgetWrapper = ({ host }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const {config, error, loading} = useWidgetConfig(host);
    const {cart} = useMagentoCart(host);

    if (!config) return null;
    if (error) return <ErrorState />
    if (loading) return <Spinner />

    const closeCart = () => setIsOpen(false);

    if (!config) return null;
    if (!cart || !config?.isReady) return null;

    return (
        <>
            {/* Trigger button (for now) */}
            {!isOpen && <MinicartTrigger cart={cart} setIsOpen={setIsOpen} config={config}/>}

            {/* Backdrop */}
            {isOpen && <div style={backdropStyle} onClick={closeCart}/>}

            {/* Drawer */}
            <div
                style={{
                    ...drawerBaseStyle,
                    ...(isOpen ? drawerOpenStyle : drawerClosedStyle),
                }}
            >
                {/* Header */}
                <MinicartHeader cart={cart} closeCart={closeCart}/>

                <div style={contentStyle}>
                    {cart.items === undefined || cart.items?.length === 0 ? <MinicartEmpty/> : <MinicartItemList cart={cart} config={config}/>}
                </div>

                {cart.items?.length > 0 && (
                    <div style={footerStyle}>
                        <MinicartFooter cart={cart} config={config}/>
                    </div>
                )}
            </div>
        </>
    );
};

