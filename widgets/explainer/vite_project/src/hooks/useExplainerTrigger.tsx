import { useEffect } from "react";
import { resolveTrigger } from "../ExplainerConfig";
import {activity} from "../activity";

export function useExplainerTrigger(
    selector: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
    useEffect(() => {
        const trigger = resolveTrigger(selector);
        if (!trigger) {
            activity(
                'explainer-trigger-missing',
                'The explainer trigger is missing',
                { selector },
                'warn'
            );
            return;
        }

        const toggle = (e: Event) => {
            e.stopPropagation();
            setOpen(v => !v);
            activity(
                'explainer-trigger',
                'Toggle explainer',
                { selector }
            );
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(v => !v);
            }
        };

        trigger.setAttribute("tabindex", "0");
        trigger.setAttribute("role", "button");

        trigger.addEventListener("click", toggle);
        trigger.addEventListener("keydown", onKeyDown);

        return () => {
            trigger.removeEventListener("click", toggle);
            trigger.removeEventListener("keydown", onKeyDown);
        };
    }, [selector, setOpen]);
}
