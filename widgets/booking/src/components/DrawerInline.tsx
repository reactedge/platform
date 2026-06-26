interface DrawerInlineProps {
    onClose: () => void;
    children: React.ReactNode;
}

export const DrawerInline: React.FC<DrawerInlineProps> = ({
    onClose,
    children,
}) => {
    return (
        <div className="drawer-inline">
            <div className="drawer-header">
                <h3>Set your appointment</h3>
                <button className="drawer-close"
                        aria-label="Close"
                        onClick={onClose}>×
                </button>
            </div>
            {children}
        </div>
    );
};
