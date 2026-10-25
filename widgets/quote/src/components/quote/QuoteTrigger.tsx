type Props = {
    title: string;
    onOpen: () => void;
};

export const QuoteTrigger = ({ title, onOpen }: Props) => (
    <button
        className="quote__trigger"
        type="button"
        aria-haspopup="dialog"
        onClick={onOpen}
        data-quote-open
    >
        {title}
    </button>
);