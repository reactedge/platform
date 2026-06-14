type FinderRowProps = {
    children: React.ReactNode;
    className?: string;
};

export const FinderRow: React.FC<FinderRowProps> = ({ children, className = '' }) => {
    return (
        <section className={`event-row ${className}`}>
            {children}
        </section>
    );
};