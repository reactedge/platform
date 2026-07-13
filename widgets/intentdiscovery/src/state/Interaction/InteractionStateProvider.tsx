import React from "react";
import {type ReactNode} from "react";
import {LocalInteractionStateContext, readInteraction, INTERACTION_STORAGE_KEY} from "./InteractionState.tsx";
import type { InteractionInfoState } from "./type.ts";
import {useImmer} from "use-immer";

interface InteractionStateProviderProps {
    children: ReactNode;
}

const LocalStateProvider = LocalInteractionStateContext.Provider;

export const InteractionStateProvider: React.FC<InteractionStateProviderProps> = ({ children }) => {
    const [interactionState, setInteractionState] = useImmer<InteractionInfoState>(
        readInteraction()
    );

    const setActiveAttribute = (attributeCode: string) => {
        setInteractionState(draft => {
            draft.navigation.activeAttribute = attributeCode;
        });

        localStorage.setItem(
            INTERACTION_STORAGE_KEY,
            JSON.stringify({
                activeAttribute: attributeCode
            })
        );
    };

    const setFocusedOption = (code: string) => {
        setInteractionState(draft => {
            draft.selection.focusedOptionCode = code;
        });
    };

    return (
        <LocalStateProvider
            value={{
                interactionState,
                setActiveAttribute,
                setFocusedOption
            }}
        >
            {children}
        </LocalStateProvider>
    );
};