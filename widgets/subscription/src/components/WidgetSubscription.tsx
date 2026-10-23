import { useState } from "react";
import type { WidgetConfig } from "../Config";
import { submitSubscriptionSelection } from "../integration/subscriptionSubmit";

type Props = {
    config: WidgetConfig;
};

export const WidgetSubscription = ({ config }: Props) => {
    const [purchaseType, setPurchaseType] = useState<
        "one-time" | "subscription"
    >("subscription");
    const [selectedPlan, setSelectedPlan] = useState("");
    const [submitError, setSubmitError] = useState("");

    const handleSubscribe = () => {
        const plan = config.data.plans.find(({ id }) => id === selectedPlan);
        if (purchaseType === "subscription" && !plan) {
            setSubmitError("Select a subscription plan to continue.");
            return;
        }

        const handled = submitSubscriptionSelection({
            purchaseType,
            sku: config.runtime.sku,
            storeCode: config.runtime.storeCode,
            ...(purchaseType === "subscription" && plan
                ? {
                    plan: {
                        id: plan.id,
                        frequency: plan.frequency,
                        discount: plan.discount,
                        termsUrl: plan.termsUrl,
                    },
                }
                : {}),
        });

        setSubmitError(
            handled
                ? ""
                : "Subscription checkout is not connected on this page."
        );
    };

    return (
        <section
            className="subscription-card"
            aria-labelledby="subscription-title"
        >
            <h1 id="subscription-title" data-subscription-title>
                {config.data.title}
            </h1>

            <label className="purchase-choice">
                <input
                    type="radio"
                    name="purchase-type"
                    value="one-time"
                    checked={purchaseType === "one-time"}
                    onChange={() => {
                        setPurchaseType("one-time");
                        setSubmitError("");
                    }}
                />
                <span>{config.data.oneTimePurchaseLabel}</span>
            </label>

            <label className="purchase-choice">
                <input
                    type="radio"
                    name="purchase-type"
                    value="subscription"
                    checked={purchaseType === "subscription"}
                    onChange={() => {
                        setPurchaseType("subscription");
                        setSubmitError("");
                    }}
                />
                <span>{config.data.subscriptionLabel}</span>
            </label>

            {purchaseType === "subscription" && (
                <fieldset className="subscription-plans">
                    <legend>{config.data.plansTitle}</legend>
                    {config.data.plans.map(plan => (
                        <div className="plan-option" key={plan.id}>
                            <label className="plan-choice">
                                <input
                                    type="radio"
                                    name="subscription-plan"
                                    value={plan.id}
                                    checked={selectedPlan === plan.id}
                                    onChange={() => {
                                        setSelectedPlan(plan.id);
                                        setSubmitError("");
                                    }}
                                />
                                <span>{plan.frequency} - {plan.discount}</span>
                            </label>
                            <a href={plan.termsUrl}>Terms &amp; Conditions</a>
                        </div>
                    ))}
                </fieldset>
            )}

            <button
                className="subscribe-button"
                type="button"
                style={{ backgroundColor: config.settings.colour }}
                onClick={handleSubscribe}
            >
                {config.data.subscribeButtonLabel}
            </button>
            {submitError && (
                <p className="subscription-submit-error" role="alert">
                    {submitError}
                </p>
            )}
        </section>
    );
};
