import type {UserCartItem} from "../../types/domain/user.type.ts";

export const getEventCartQty = (cart: UserCartItem[], eventIds: string[]): number => {
    const cartItem = cart?.filter((item: UserCartItem) => eventIds.indexOf(item.event.id)>-1)
    if (cartItem && cartItem.length > 0) {
        return cartItem[0].quantity
    }

    return 0
}

export const isEventInCart = (cart: UserCartItem[], eventId: string): boolean => {
    const cartItem = cart?.filter((item: UserCartItem) => item.event.id === eventId)
    if (cartItem && cartItem.length > 0) {
        return true
    }

    return false
}