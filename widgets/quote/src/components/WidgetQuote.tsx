import type { BootstrapData } from "../entrypoints/ssr.tsx";
import type { WidgetConfig } from "../Config";
import { QuoteDialog } from "./quote/QuoteDialog.tsx";
import { QuoteTrigger } from "./quote/QuoteTrigger.tsx";
import { useQuoteDialogController } from "../hooks/domain/useQuoteDialogController.ts";

type Props = {
    config: WidgetConfig;
    bootstrap?: BootstrapData;
};

export const WidgetQuote = ({
    config,
    bootstrap
}: Props) => {
    const { openDialog, dialog, product, search, quote } = useQuoteDialogController(config, bootstrap);

    return (
        <section className="quote" aria-label={config.data.title}>
            <QuoteTrigger title={config.data.title} onOpen={openDialog} />
            <QuoteDialog
                dialog={dialog}
                product={product}
                search={search}
                quote={quote}
            />
        </section>
    );
};