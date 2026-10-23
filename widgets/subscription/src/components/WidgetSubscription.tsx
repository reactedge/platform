import { useState } from "react";
import type { WidgetConfig } from "../Config";

type Props = {
    config: WidgetConfig;
};

export const WidgetSubscription = ({ config }: Props) => {
    const [purchaseType, setPurchaseType] = useState<"one-time" | "subscription">("subscription");
    const [selectedPlan, setSelectedPlan] = useState("");

    return (
        <section className="subscription-card" aria-labelledby="subscription-title">
            <h1 id="subscription-title" data-subscription-title>
                {config.data.title}
            </h1>

            <label className="purchase-choice">
                <input
                    type="radio"
                    name="purchase-type"
                    value="one-time"
                    checked={purchaseType === "one-time"}
                    onChange={() => setPurchaseType("one-time")}
                />
                <span>{config.data.oneTimePurchaseLabel}</span>
            </label>

            <label className="purchase-choice">
                <input
                    type="radio"
                    name="purchase-type"
                    value="subscription"
                    checked={purchaseType === "subscription"}
                    onChange={() => setPurchaseType("subscription")}
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
                                    onChange={() => setSelectedPlan(plan.id)}
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
            >
                {config.data.subscribeButtonLabel}
            </button>
        </section>
    );
};
