import type { WidgetConfig } from '../Config';
import { useListingController } from '../controller/useListingController.ts';
import { ListingCapabilities } from './ListingCapabilities.tsx';
import { ListingEditor } from './ListingEditor.tsx';
import { ListingFeedback } from './ListingFeedback.tsx';
import { SavedListings } from './SavedListings.tsx';

type Props = { config: WidgetConfig };

export const WidgetCreatelisting = ({ config }: Props) => {
    const controller = useListingController();

    return (
        <section className="word-editor listing-workspace">
            <header className="word-editor__header">
                <h1 data-createlisting-title className="word-editor__title" style={{ color: config.settings.colour }}>
                    {config.data.title}
                </h1>
                <p className="word-editor__subtitle">Listing capabilities</p>
            </header>
            <div className="word-editor__workspace">
                <ListingCapabilities mode={controller.mode} disabled={controller.disabled} onChoose={controller.begin} />
                <div className="word-editor__document-area">
                    <div className="word-editor__document listing-workspace__content">
                        <ListingEditor controller={controller} />
                        <ListingFeedback loading={controller.loading} mode={controller.mode}
                            message={controller.message} error={controller.error} />
                        <SavedListings listings={controller.listings} />
                    </div>
                </div>
            </div>
        </section>
    );
};
