import { type ReactNode, useMemo } from "react";
import { LocalTranslationStateContext } from "./TranslationState.tsx";
import { createTranslator } from "../../lib/translate.ts";

interface Props {
    readonly children: ReactNode;
    readonly translations: Record<string, string> | undefined;
}

export function TranslationStateProvider({ children, translations }: Props) {
    const t = useMemo(() => createTranslator(translations), [translations]);
    return (
        <LocalTranslationStateContext.Provider value={{ t }}>
            {children}
        </LocalTranslationStateContext.Provider>
    );
}
