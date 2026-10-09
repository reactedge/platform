import type { WidgetConfig } from '../Config';
import { useListingController } from '../controller/useListingController.ts';
import { useProductController } from '../controller/useProductController.ts';
import { ListingCapabilities } from './ListingCapabilities.tsx';
import { ListingEditor } from './ListingEditor.tsx';
import { ListingFeedback } from './ListingFeedback.tsx';
import { SavedListings } from './SavedListings.tsx';
import { ProductCapabilities } from './product/ProductCapabilities.tsx';
import { ProductWorkspace } from './product/ProductWorkspace.tsx';

type Props = { config: WidgetConfig };

export const WidgetCreatelisting = ({ config }: Props) => {
    const listingController = useListingController(config.runtime.sellerId);
    const productController = useProductController();

    const chooseListing = (action: Parameters<typeof listingController.begin>[0]) => {
        productController.cancel();
        listingController.begin(action);
    };

    const chooseProduct = (mode: Parameters<typeof productController.begin>[0]) => {
        listingController.cancel();
        productController.begin(mode);
    };

    const productActive = productController.mode !== null;
    const selectedProductCount = listingController.selected
        ? productController.products.filter(product => product.listingId === listingController.selected?.id).length
        : 0;

    return (
        <section className="word-editor listing-workspace">
            <header className="word-editor__header">
                <h1 data-createlisting-title className="word-editor__title" style={{ color: config.settings.colour }}>
                    {config.data.title}
                </h1>
                <p className="word-editor__subtitle">Listing capabilities</p>
            </header>
            <div className="word-editor__workspace">
                <ListingCapabilities mode={listingController.mode} disabled={listingController.disabled} onChoose={chooseListing}>
                    <ProductCapabilities mode={productController.mode}
                        disabled={listingController.disabled || productController.disabled} onChoose={chooseProduct} />
                </ListingCapabilities>
                <div className="word-editor__document-area">
                    <div className="word-editor__document listing-workspace__content">
                        {productActive ? (
                            <ProductWorkspace listings={listingController.listings} controller={productController} />
                        ) : (
                            <>
                                <ListingEditor controller={listingController} selectedProductCount={selectedProductCount} />
                                <ListingFeedback loading={listingController.loading} mode={listingController.mode}
                                    message={listingController.message} error={listingController.error} />
                            </>
                        )}
                        <SavedListings listings={listingController.listings} products={productController.products} />
                    </div>
                </div>
            </div>
        </section>
    );
};
