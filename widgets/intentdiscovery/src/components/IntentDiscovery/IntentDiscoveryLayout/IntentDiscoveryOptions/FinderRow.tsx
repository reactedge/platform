type FinderRowProps = {
    children: React.ReactNode;
    className?: string;
};

export const FinderRow: React.FC<FinderRowProps> = ({ children, className = '' }) => {
    return (
        <div className={`event-row ${className}`}>
            {children}
        </div>
    );
};