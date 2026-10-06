import type { WidgetConfig } from "../Config";
import { useProductData } from "../hooks/domain/useProductData";
import type {BootstrapData} from "../entrypoints/ssr";

type Props = {
    config: WidgetConfig;
    bootstrap?: BootstrapData;
};

export const WidgetCreatelisting = ({
     config,
     bootstrap
 }: Props) => {
    const {
        productData,
        productError,
        productLoading,
    } = useProductData(config.runtime.sku, bootstrap);

    return (
        <section className="word-editor listing-workspace">
            <header className="word-editor__header">
                <h1
                    data-createlisting-title
                    className="word-editor__title"
                    style={{ color: config.settings.colour }}
                >
                    {config.data.title}
                </h1>
                <p className="word-editor__subtitle">
                    Listing capabilities
                </p>
            </header>

            <div className="word-editor__workspace">
                <aside className="word-editor__block-palette" aria-label="Listing capabilities">
                    <h2 className="word-editor__block-palette-title">Capabilities</h2>
                    <ul className="listing-workspace__capabilities">
                        {['Create listing', 'Edit listing', 'Delete listing'].map(capability => (
                            <li key={capability} className="word-editor__block">
                                {capability}
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="word-editor__document-area">
                    <div className="word-editor__document listing-workspace__content">
                        {productLoading && <p role="status">Loading product...</p>}
                        {productError && <p role="alert">Unable to load product.</p>}
                        {!productLoading && !productError && productData && (
                            <dl data-createlisting-product>
                                <dt>SKU</dt>
                                <dd>{productData.sku}</dd>
                                <dt>Name</dt>
                                <dd>{productData.name}</dd>
                            </dl>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
