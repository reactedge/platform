import { createContext, useContext, type ReactNode } from "react";
import type { CmsBlockController } from "../../hooks/domain/useCmsBlockController.ts";

const CmsBlockControllerContext = createContext<CmsBlockController | null>(null);

export function CmsBlockControllerProvider({
    value,
    children,
}: {
    value: CmsBlockController;
    children: ReactNode;
}) {
    return (
        <CmsBlockControllerContext.Provider value={value}>
            {children}
        </CmsBlockControllerContext.Provider>
    );
}

export function useCmsBlockControllerContext(): CmsBlockController {
    const context = useContext(CmsBlockControllerContext);
    if (!context) {
        throw new Error("CMS block controller context is unavailable.");
    }
    return context;
}
