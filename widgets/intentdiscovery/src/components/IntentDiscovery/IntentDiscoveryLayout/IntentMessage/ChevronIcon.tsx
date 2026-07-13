
type Props = {
    direction: 'down' | 'right'
};
export const ChevronIcon = ({direction}: Props) => {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24">
            {direction === "right" && (
                <path d="M9 6l6 6-6 6" stroke="currentColor" fill="none" strokeWidth="2" />
            )}
            {direction === "down" && (
                <path d="M6 9l6 6 6-6" stroke="currentColor" fill="none" strokeWidth="2" />
            )}
        </svg>
    );
}