import {useEffect} from "react";

interface DrawerInlineProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const DrawerInline: React.FC<DrawerInlineProps> = ({
    isOpen,
    onClose,
    children,
}) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", onKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`drawer-overlay ${isOpen ? "is-open" : ""}`}
                onClick={onClose}
            />

            <aside
                className={`drawer drawer ${isOpen ? "is-open" : ""}`}
            >
                {children}
            </aside>
        </>

    );
};
