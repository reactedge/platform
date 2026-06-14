import {type ReactNode, useMemo} from "react";
import {LocalTranslationStateContext} from "./TranslationState.tsx";
import type {TranslationsConfig} from "../../domain/store.types.ts";
import {createTranslator} from "../../lib/translate.ts";

interface TranslationStateProviderProps {
    children: ReactNode;
    translations: TranslationsConfig;
}

const LocalStateProvider = LocalTranslationStateContext.Provider;

export const TranslationStateProvider: React.FC<TranslationStateProviderProps> = ({ children, translations }) => {
    const t = useMemo(
        () => createTranslator(translations),
        [translations]
    );

    return (
        <LocalStateProvider
            value={{
                t
            }}
        >
            {children}
        </LocalStateProvider>
    );
};
