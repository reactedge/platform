import type { WidgetConfig } from "../Config";
import { QuoteDialog } from "./quote/QuoteDialog.tsx";
import { QuoteTrigger } from "./quote/QuoteTrigger.tsx";
import { useQuoteDialogController } from "../hooks/domain/useQuoteDialogController.ts";

type Props = {
    config: WidgetConfig;
};

export const WidgetQuote = ({ config }: Props) => {
    const { openDialog, dialog, search, quote, delivery } = useQuoteDialogController(config);

    return (
        <section className="quote" aria-label={config.data.title}>
            <QuoteTrigger title={config.data.title} onOpen={openDialog} />
            <QuoteDialog
                dialog={dialog}
                search={search}
                quote={quote}
                delivery={delivery}
            />
        </section>
    );
};
