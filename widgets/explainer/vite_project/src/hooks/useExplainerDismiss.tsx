import { useEffect, type RefObject } from "react";

export function useExplainerDismiss(
    open: boolean,
    cardRef: RefObject<HTMLElement | null>,
    setOpen: (open: boolean) => void
) {
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        const onClick = (e: MouseEvent) => {
            if (
                cardRef.current &&
                !cardRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("keydown", onKey);
        document.addEventListener("click", onClick);

        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("click", onClick);
        };
    }, [open, cardRef, setOpen]);
}
