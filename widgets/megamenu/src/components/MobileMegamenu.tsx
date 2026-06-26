import {useState} from "react";
import {Loading} from "./Loading.tsx";
import type {MegaMenuProps} from "../domain/megamenu.types.ts";
import {DrawerInline} from "./Drawer/DrawerInline.tsx";
import {MegamenuContent} from "./MobileMegamenu/MenuContent.tsx";

export function MobileMegamenu({ items, loading = false, theme }: MegaMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (loading || (items && !items.length)) return <Loading />

    return (
        <>
            <button
                className="menu-toggle"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsOpen(true)}
            >
                ☰
            </button>

            <DrawerInline
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <MegamenuContent items={items} theme={theme} />
            </DrawerInline>
        </>
    );
}