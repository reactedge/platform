import { useState } from "react";
import { useActivityContext } from "../activity/Context/useActivityContext.ts";
import { submitSubscriptionSelection } from "../integration/subscriptionSubmit.ts";
import type { SubscriptionPlan } from "../Config.ts";

type ControllerStatus = "idle" | "error";
type TermsStatus = ControllerStatus | "loading" | "success";

export function useSubscriptionController(termsUrl: string) {
    const activity = useActivityContext();
    const [status, setStatus] = useState<ControllerStatus>("idle");
    const [message, setMessage] = useState("");
    const [termsStatus, setTermsStatus] = useState<TermsStatus>("idle");
    const [termsHtml, setTermsHtml] = useState("");

    const subscribe = (sku: string, storeCode: string, plan: SubscriptionPlan) => {
        setStatus("idle");
        setMessage("");
        activity.log("subscription-submit", "Dispatch subscription selection", {
            sku,
            storeCode,
            subscriptionPlanId: plan.id,
        });

        const handled = submitSubscriptionSelection({
            purchaseType: "subscription",
            sku,
            storeCode,
            plan: {
                id: plan.id,
                frequency: plan.frequency,
                ...(plan.discount ? { discount: plan.discount } : {}),
                ...(plan.termsBlockId ? { termsBlockId: plan.termsBlockId } : {}),
            },
        });

        if (!handled) {
            setStatus("error");
            setMessage("Subscription checkout is not connected on this page.");
        }
    };

    const loadTerms = async (blockId: string) => {
        setTermsStatus("loading");
        setTermsHtml("");

        try {
            const url = new URL(termsUrl, window.location.origin);
            url.searchParams.set("block_id", blockId);
            const response = await fetch(url.toString(), {
                headers: { Accept: "text/html" },
            });
            if (!response.ok) throw new Error("Unable to load terms.");
            setTermsHtml(await response.text());
            setTermsStatus("success");
        } catch (error) {
            activity.log("subscription-terms", "Load terms failed", error, "error");
            setTermsStatus("error");
        }
    };

    return { status, message, subscribe, termsStatus, termsHtml, loadTerms };
}
