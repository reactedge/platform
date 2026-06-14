import type {KeystoneCartItem} from "../../types/infra/keystone";

export default function calcTotalPrice(cart: KeystoneCartItem[]) {
    return cart && cart.reduce((tally, cartItem) => {
        if (!cartItem.event) return tally; // products can be deleted, but they could still be in your cart
        return tally + cartItem.quantity * cartItem.price;
    }, 0);
}