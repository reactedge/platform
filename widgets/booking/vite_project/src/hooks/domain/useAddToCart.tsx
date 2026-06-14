import {useKeystoneAddToCart} from "../infra/useKeystoneAddToCart.tsx";

/**
 * Domain-facing add-to-cart hook.
 * Currently delegates to Keystone infra implementation.
 * Domain rules (validation, intent checks, analytics) may be added here later.
 */
export const useAddToCart = () => {
    return useKeystoneAddToCart();
}