import type { WidgetConfig } from "../Config";
import { useProductData } from "../hooks/domain/useProductData";
import type {BootstrapData} from "../bootstrap/ssr/render.tsx";

type Props = {
    config: WidgetConfig;
    bootstrap?: BootstrapData;
};

export const Widget__WIDGET_PASCAL_NAME__ = ({
     config,
     bootstrap
 }: Props) => {
    const {
        productData,
        productError,
        productLoading,
    } = useProductData(config.runtime.sku, bootstrap);

    if (productLoading) {
        return <p>Loading product...</p>;
    }

    if (productError) {
        return <p>Unable to load product.</p>;
    }

    return (
        <>
            <h1
                data-__WIDGET_NAME__-title
                style={{ color: config.settings.colour }}
            >
                {config.data.title}
            </h1>

            {productData && (
                <dl data-__WIDGET_NAME__-product>
                    <dt>SKU</dt>
                    <dd>{productData.sku}</dd>

                    <dt>Name</dt>
                    <dd>{productData.name}</dd>
                </dl>
            )}
        </>
    );
};
