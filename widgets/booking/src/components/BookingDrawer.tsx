interface BookingDrawerProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const BookingDrawer: React.FC<BookingDrawerProps> = ({
    open,
    onClose,
    children,
}) => {
    if (!open) return null;

    return (
        <div className="booking-drawer-backdrop" onClick={onClose}>
            <div
                className="booking-drawer"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="drawer-header">
                    <h3>Set your appointment</h3>
                    <button className="drawer-close"
                            aria-label="Close"
                            onClick={onClose}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
};
