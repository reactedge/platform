import { useState } from "react";
import type { WidgetConfig } from "../Config.ts";
import { useProductData } from "../hooks/domain/useProductData.tsx";
import type { BootstrapData } from "../entrypoints/ssr.tsx";
import { useSubscriptionController } from "../controller/useSubscriptionController.ts";

type Props = {
    config: WidgetConfig;
    bootstrap?: BootstrapData;
};

export const WidgetSubscription = ({ config, bootstrap }: Props) => {
    const { productData, productError, productLoading } = useProductData(config.runtime.sku, bootstrap);
    const [purchaseType, setPurchaseType] = useState<"one-time" | "subscription">("one-time");
    const [selectedPlanId, setSelectedPlanId] = useState(config.data.plans[0]?.id ?? "");
    const [termsPlanId, setTermsPlanId] = useState<string | null>(null);
    const { status, message, subscribe, termsStatus, termsHtml, loadTerms } = useSubscriptionController(config.runtime.termsUrl);

    if (productLoading) return <p>Loading product...</p>;
    if (productError || !productData) return <p>Unable to load product.</p>;

    const showTerms = (blockId: string, planId: string) => {
        setTermsPlanId(planId);
        void loadTerms(blockId);
    };

    if (!config.data.isCustomerLoggedIn) {
        return (
            <section className="subscription-widget" data-subscription-widget>
                <h2>{config.data.title}</h2>
                <p>Please <a href={config.data.loginUrl ?? "/customer/account/login"}>sign in</a> to subscribe.</p>
            </section>
        );
    }

    return (
        <section className="subscription-widget" data-subscription-widget>
            <h2 data-subscription-title style={{ color: config.settings.colour }}>{config.data.title}</h2>
            <p className="subscription-product-name">{productData.name}</p>
            <p data-subscription-product>
                <span>{productData.sku}</span>
                <span>{productData.name}</span>
            </p>

            <fieldset className="subscription-purchase-type">
                <legend>Purchase options</legend>
                <label>
                    <input
                        type="radio"
                        name="subscription-purchase-type"
                        value="one-time"
                        checked={purchaseType === "one-time"}
                        onChange={() => setPurchaseType("one-time")}
                    />
                    One-time purchase
                </label>
                <label>
                    <input
                        type="radio"
                        name="subscription-purchase-type"
                        value="subscription"
                        checked={purchaseType === "subscription"}
                        onChange={() => setPurchaseType("subscription")}
                    />
                    Subscribe &amp; Save
                </label>
            </fieldset>

            {purchaseType === "subscription" && (
                <div className="subscription-plans" data-subscription-plans>
                    <fieldset>
                        <legend>Choose a delivery plan</legend>
                        {config.data.plans.length === 0 && <p>No subscription plans are available.</p>}
                        {config.data.plans.map((plan) => (
                            <div className="subscription-plan" key={plan.id}>
                                <label>
                                    <input
                                        type="radio"
                                        name="subscription-plan"
                                        value={plan.id}
                                        checked={selectedPlanId === plan.id}
                                        onChange={() => setSelectedPlanId(plan.id)}
                                    />
                                    <span>{plan.label}</span>
                                    <span>{plan.frequency}</span>
                                    {plan.discount && <span>{plan.discount}</span>}
                                </label>
                                {plan.termsBlockId && (
                                    <button
                                        type="button"
                                        className="subscription-terms-link"
                                        onClick={() => showTerms(plan.termsBlockId!, plan.id)}
                                    >
                                        View terms
                                    </button>
                                )}
                            </div>
                        ))}
                    </fieldset>
                    <button
                        type="button"
                        className="subscription-submit"
                        disabled={!selectedPlanId || config.data.plans.length === 0}
                        onClick={() => {
                            const plan = config.data.plans.find(({ id }) => id === selectedPlanId);
                            if (plan) subscribe(config.runtime.sku, config.runtime.storeCode, plan);
                        }}
                    >
                        Subscribe
                    </button>
                    {message && (
                        <p role={status === "error" ? "alert" : "status"} data-subscription-message>
                            {message}
                        </p>
                    )}
                </div>
            )}

            {termsPlanId && (
                <div className="subscription-modal-backdrop" onClick={() => setTermsPlanId(null)}>
                    <section
                        className="subscription-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="subscription-terms-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header>
                            <h2 id="subscription-terms-title">Subscription Terms &amp; Conditions</h2>
                            <button type="button" aria-label="Close terms" onClick={() => setTermsPlanId(null)}>×</button>
                        </header>
                        {termsStatus === "loading" && <p>Loading terms…</p>}
                        {termsStatus === "error" && <p role="alert">Unable to load terms. Please try again.</p>}
                        {termsStatus === "success" && (
                            <div className="subscription-terms-content" dangerouslySetInnerHTML={{ __html: termsHtml }} />
                        )}
                    </section>
                </div>
            )}
        </section>
    );
};
