import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getError } from "../../lib/error.ts";
import { useSystemState } from "../../state/System/useSystemState.ts";
import { MagentoDeliveryEstimator, type DeliveryMethodEstimate } from "../../services/magento/MagentoDeliveryEstimator.ts";
import type { QuoteLine } from "./useQuoteLines.ts";

export function useDeliveryEstimate(lines: QuoteLine[], countryCode: string) {
    const { graphqlClient } = useSystemState();
    const estimator = useMemo(() => new MagentoDeliveryEstimator(graphqlClient), [graphqlClient]);
    const [postcode, setPostcode] = useState("");
    const [methods, setMethods] = useState<DeliveryMethodEstimate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasEstimate, setHasEstimate] = useState(false);
    const requestVersion = useRef(0);
    const itemsSignature = JSON.stringify(lines.map(line => [line.sku, line.quantity]));

    const onPostcodeChange = useCallback((value: string) => {
        requestVersion.current += 1;
        setPostcode(value);
        setMethods([]);
        setError(null);
        setHasEstimate(false);
        setLoading(false);
    }, []);

    useEffect(() => {
        requestVersion.current += 1;
        setMethods([]);
        setError(null);
        setHasEstimate(false);
    }, [itemsSignature]);

    const estimate = useCallback(async () => {
        const currentVersion = ++requestVersion.current;
        setLoading(true);
        setError(null);
        setMethods([]);
        setHasEstimate(false);

        try {
            const result = await estimator.estimate(
                lines.map(({ sku, quantity }) => ({ sku, quantity })),
                postcode,
                countryCode
            );
            if (requestVersion.current !== currentVersion) return;
            setMethods(result);
            setHasEstimate(true);
        } catch (reason) {
            if (requestVersion.current === currentVersion) setError(getError(reason));
        } finally {
            if (requestVersion.current === currentVersion) setLoading(false);
        }
    }, [countryCode, estimator, lines, postcode]);

    return {
        postcode,
        onPostcodeChange,
        methods,
        loading,
        error,
        hasEstimate,
        onEstimate: estimate,
        disabled: lines.length === 0,
    };
}
